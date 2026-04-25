type CurrencyOptions = {
  locale?: string;
  currency?: string;
};

export function formatCurrency(
  value: number,
  { locale = 'pt-BR', currency = 'BRL' }: CurrencyOptions = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}
