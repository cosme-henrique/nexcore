import { formatPhone } from './formatPhone';

describe('formatPhone', () => {
  it('should format cellphone with 11 digits', () => {
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
  });

  it('should format landline with 10 digits', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('should format phone with mask characters', () => {
    expect(formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
  });
});
