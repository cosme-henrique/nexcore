import { formatCPF } from './formatCPF';

describe('formatCPF', () => {
  it('should format raw digits', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01');
  });

  it('should format already masked CPF', () => {
    expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
  });
});
