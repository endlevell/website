import { z } from 'zod';
import { formString, optionalFormString, slugify, splitCommaList } from './common';

const optionalUrl = z
  .string()
  .refine((value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid URL')
  .nullable()
  .or(z.literal(null));

export const projectStatusSchema = z.enum(['active', 'archived', 'wip']);

export const projectFormSchema = z.object({
  title: z.string().min(1).max(160),
  slug: z.string().min(1).max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1).max(280),
  body: z.string().min(1),
  techTags: z.array(z.string().min(1).max(40)).min(1).max(24),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  coverImage: z.string().max(240).nullable(),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
  status: projectStatusSchema,
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function parseProjectForm(formData: FormData) {
  const title = formString(formData, 'title');
  const rawSlug = formString(formData, 'slug');

  return projectFormSchema.safeParse({
    title,
    slug: rawSlug || slugify(title),
    summary: formString(formData, 'summary'),
    body: formString(formData, 'body'),
    techTags: splitCommaList(formString(formData, 'techTags')),
    repoUrl: optionalFormString(formData, 'repoUrl'),
    liveUrl: optionalFormString(formData, 'liveUrl'),
    coverImage: optionalFormString(formData, 'coverImage'),
    featured: formData.has('featured'),
    sortOrder: Number(formString(formData, 'sortOrder') || 0),
    status: formString(formData, 'status'),
  });
}
