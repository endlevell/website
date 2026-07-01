import rehypeShiki from '@shikijs/rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Schema } from 'hast-util-sanitize';
import { unified } from 'unified';

const sanitizeSchema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    pre: [...(defaultSchema.attributes?.pre ?? []), ['className'], ['style']],
    code: [...(defaultSchema.attributes?.code ?? []), ['className'], ['style']],
    span: [...(defaultSchema.attributes?.span ?? []), ['className'], ['style']],
  },
} as Schema;

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeShiki, { theme: 'catppuccin-mocha' })
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeStringify);

export async function renderMarkdown(markdown: string): Promise<string> {
  try {
    const file = await processor.process(markdown);
    return String(file);
  } catch (error) {
    console.error('Markdown render failed', error);
    return '<p>markdown render failed</p>';
  }
}
