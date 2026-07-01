import { z } from 'zod';
import { formString, optionalFormString, slugify, splitCommaList } from './common';

export const postFormSchema = z.object({
  title: z.string().min(1).max(180),
  slug: z.string().min(1).max(110).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(1).max(320),
  body: z.string().min(1),
  coverImage: z.string().max(240).nullable(),
  tags: z.array(z.string().min(1).max(40)).min(1).max(24),
  published: z.boolean(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export function parsePostForm(formData: FormData) {
  const title = formString(formData, 'title');
  const rawSlug = formString(formData, 'slug');

  return postFormSchema.safeParse({
    title,
    slug: rawSlug || slugify(title),
    excerpt: formString(formData, 'excerpt'),
    body: formString(formData, 'body'),
    coverImage: optionalFormString(formData, 'coverImage'),
    tags: splitCommaList(formString(formData, 'tags')),
    published: formData.has('published'),
  });
}
