export function formatDate(date: Date | null): string {
  if (!date) {
    return 'draft';
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}
