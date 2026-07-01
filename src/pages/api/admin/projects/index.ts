import type { APIRoute } from 'astro';
import { createProject } from '../../../../lib/admin/data';
import { badRequest, formatZodError, redirect303 } from '../../../../lib/admin/http';
import { hasSameOrigin } from '../../../../lib/auth/origin';
import { parseProjectForm } from '../../../../lib/validation/project';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!hasSameOrigin(request)) {
    return badRequest('origin rejected', 403);
  }

  const parsed = parseProjectForm(await request.formData());

  if (!parsed.success) {
    return badRequest(formatZodError(parsed.error));
  }

  try {
    await createProject(parsed.data);
  } catch {
    return badRequest('project slug already exists', 409);
  }

  return redirect303('/admin/projects');
};
