import { strict as assert } from 'node:assert';
import { renderMarkdown } from '../src/lib/markdown/render';

const html = await renderMarkdown(`
# Probe

<script>alert("x")</script>

<img src="x" onerror="alert(1)" />

[bad](javascript:alert(1))

\`\`\`ts
const value = 42;
\`\`\`
`);

assert(!html.includes('<script'), 'script tag must not render');
assert(!html.includes('onerror='), 'event handler attribute must not render');
assert(!html.includes('javascript:'), 'javascript URLs must not render');
assert(html.includes('const') && html.includes('value'), 'code block should render');

console.log('Markdown sanitization smoke test passed.');
