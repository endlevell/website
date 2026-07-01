import type { APIRoute } from 'astro';
import { createPost } from '../../../../lib/admin/data';
import { badRequest, formatZodError, redirect303 } from '../../../../lib/admin/http';
import { hasSameOrigin } from '../../../../lib/auth/origin';
import { parsePostForm } from '../../../../lib/validation/post';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!hasSameOrigin(request)) {
    return badRequest('origin rejected', 403);
  }

  const parsed = parsePostForm(await request.formData());

  if (!parsed.success) {
    return badRequest(formatZodError(parsed.error));
  }

  try {
    await createPost(parsed.data);
  } catch {
    return badRequest('post slug already exists', 409);
  }

  return redirect303('/admin/posts');
};
