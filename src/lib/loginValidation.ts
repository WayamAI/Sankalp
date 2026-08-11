const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginValidationResult = { valid: true } | { valid: false; error: string };

export function validateLoginInput(email: string, password: string): LoginValidationResult {
  if (!EMAIL_PATTERN.test(email)) {
    return { valid: false, error: "Enter a valid email address." };
  }
  if (password.trim().length === 0) {
    return { valid: false, error: "Enter a password." };
  }
  return { valid: true };
}
