type DateStyle = 'short' | 'medium' | 'long';

const DATE_STYLES: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { day: '2-digit', month: '2-digit', year: 'numeric' },
  medium: { day: '2-digit', month: 'short', year: 'numeric' },
  long: { day: '2-digit', month: 'long', year: 'numeric' },
};

export function formatDate(
  date: string | Date,
  style: DateStyle = 'short',
  locale = 'pt-BR',
): string {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, DATE_STYLES[style]).format(parsed);
}
