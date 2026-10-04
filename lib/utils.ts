export const cn = (
  ...v: (string | false | null | undefined)[]
) => v.filter(Boolean).join(' ');

export const formatDate = (
  d: string | Date | null | undefined
) => {
  if (!d) return 'Just now';

  const date = new Date(d);

  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};