export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  const isCellphone = digits.length === 11;

  return isCellphone
    ? digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    : digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}
