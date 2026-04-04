export function toBearerToken(value: string): string {
  const trimmed = value.trim();
  return trimmed.toLowerCase().startsWith('bearer ') ? trimmed : `Bearer ${trimmed}`;
}

export function stripBearerPrefix(value: string): string {
  return value.trim().replace(/^Bearer\s+/i, '');
}

export function maskPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length <= 4) return phoneNumber;
  return `+91${digits.slice(0, 2)}****${digits.slice(-4)}`;
}

export function titleCase(value: string): string {
  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}
