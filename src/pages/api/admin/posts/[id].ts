import type { APIRoute } from 'astro';
import { deletePost, getAdminPost, updatePost } from '../../../../lib/admin/data';
import { badRequest, formatZodError, redirect303 } from '../../../../lib/admin/http';
import { hasSameOrigin } from '../../../../lib/auth/origin';
import { parsePostForm } from '../../../../lib/validation/post';

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
  const existing = id ? await getAdminPost(id) : null;

  if (!id || !existing) {
    return badRequest('post not found', 404);
  }

  const formData = await request.formData();

  if (formData.get('intent') === 'delete') {
    await deletePost(id);
    return redirect303('/admin/posts');
  }

  const parsed = parsePostForm(formData);

  if (!parsed.success) {
    return badRequest(formatZodError(parsed.error));
  }

  try {
    await updatePost(id, parsed.data, existing);
  } catch {
    return badRequest('post slug already exists', 409);
  }

  return redirect303('/admin/posts');
};
