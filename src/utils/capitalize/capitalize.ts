export function capitalize(text: string): string {
  return text.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}
