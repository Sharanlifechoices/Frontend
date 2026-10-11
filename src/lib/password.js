// Mirrors the server policy (app/core/passwords.py). The server is the real gate; this gives live feedback.
const SPECIALS = '!@#$%^&*()_+-=[]{};\':"\\|,.<>/?`~'

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'special', label: 'One special symbol (e.g. ! @ # $ %)', test: (p) => [...p].some((c) => SPECIALS.includes(c)) },
]

export function passwordFailures(password) {
  return PASSWORD_RULES.filter((r) => !r.test(password))
}
