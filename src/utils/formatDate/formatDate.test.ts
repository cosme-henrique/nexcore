import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format date in short style by default', () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe('15/01/2024');
  });

  it('should format date in medium style', () => {
    expect(formatDate(new Date(2024, 0, 15), 'medium')).toBe('15 de jan. de 2024');
  });

  it('should format date in long style', () => {
    expect(formatDate(new Date(2024, 0, 15), 'long')).toBe('15 de janeiro de 2024');
  });

  it('should accept a string date', () => {
    expect(formatDate('2024-01-15T03:00:00.000Z', 'short')).toBe('15/01/2024');
  });
});
