export function redirect303(location: string): Response {
  return new Response(null, {
    status: 303,
    headers: {
      location,
    },
  });
}

export function badRequest(message: string, status = 400): Response {
  return new Response(message, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}

export function formatZodError(error: { issues: Array<{ path: PropertyKey[]; message: string }> }): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'form'}: ${issue.message}`)
    .join('\n');
}
