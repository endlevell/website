import type { APIRoute } from 'astro';
import { deleteProject, getAdminProject, updateProject } from '../../../../lib/admin/data';
import { badRequest, formatZodError, redirect303 } from '../../../../lib/admin/http';
import { hasSameOrigin } from '../../../../lib/auth/origin';
import { parseProjectForm } from '../../../../lib/validation/project';

export const prerender = false;

function parseId(value: string | undefined): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const POST: APIRoute = async ({ params, request }) => {
  if (!hasSameOrigin(request)) {
    return badRequest('origin rejected', 403);
  }

  const id = parseId(params.id);

  if (!id || !(await getAdminProject(id))) {
    return badRequest('project not found', 404);
  }

  const formData = await request.formData();

  if (formData.get('intent') === 'delete') {
    await deleteProject(id);
    return redirect303('/admin/projects');
  }

  const parsed = parseProjectForm(formData);

  if (!parsed.success) {
    return badRequest(formatZodError(parsed.error));
  }

  try {
    await updateProject(id, parsed.data);
  } catch {
    return badRequest('project slug already exists', 409);
  }

  return redirect303('/admin/projects');
};
