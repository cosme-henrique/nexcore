const CNPJ_WEIGHTS_FIRST = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_WEIGHTS_SECOND = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

const calcCheckDigit = (digits: string, weights: number[]): number => {
  const sum = digits
    .split('')
    .reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

export function isValidCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');

  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const firstDigit = calcCheckDigit(digits.slice(0, 12), CNPJ_WEIGHTS_FIRST);
  const secondDigit = calcCheckDigit(digits.slice(0, 13), CNPJ_WEIGHTS_SECOND);

  return firstDigit === Number(digits[12]) && secondDigit === Number(digits[13]);
}
