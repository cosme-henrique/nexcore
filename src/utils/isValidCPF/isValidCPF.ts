export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calcCheckDigit = (slice: string, factor: number): number => {
    const sum = slice
      .split('')
      .reduce((acc, digit, index) => acc + Number(digit) * (factor - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder >= 10 ? 0 : remainder;
  };

  const firstDigit = calcCheckDigit(digits.slice(0, 9), 10);
  const secondDigit = calcCheckDigit(digits.slice(0, 10), 11);

  return firstDigit === Number(digits[9]) && secondDigit === Number(digits[10]);
}
