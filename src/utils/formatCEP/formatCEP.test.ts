import { formatCEP } from './formatCEP';

describe('formatCEP', () => {
  it('should format raw digits', () => {
    expect(formatCEP('01310100')).toBe('01310-100');
  });

  it('should format already masked CEP', () => {
    expect(formatCEP('01310-100')).toBe('01310-100');
  });
});
