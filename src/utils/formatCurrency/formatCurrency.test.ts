import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('should format value to BRL by default', () => {
    expect(formatCurrency(1000)).toBe('R$\u00a01.000,00');
  });

  it('should format decimal values correctly', () => {
    expect(formatCurrency(1990.5)).toBe('R$\u00a01.990,50');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('R$\u00a00,00');
  });

  it('should support custom locale and currency', () => {
    expect(formatCurrency(1000, { locale: 'en-US', currency: 'USD' })).toBe('$1,000.00');
  });
});
