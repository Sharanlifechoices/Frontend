// Karmic number: add every digit of the date of birth (YYYY-MM-DD) and repeat until a single digit (1-9).
// It is also the id of the matching book (/books/1 ... /books/9).
function reduceDigits(n) {
  return String(n).split('').reduce((a, c) => a + Number(c), 0)
}

export function calcKarmic(dateStr) {
  let sum = dateStr.replace(/-/g, '').split('').reduce((a, c) => a + Number(c), 0)
  while (sum > 9) sum = reduceDigits(sum)
  return sum
}

// The number for a saved date of birth, or null when it is missing, malformed, in the future or before 1900.
export function karmicFromDob(dob, today = new Date().toISOString().slice(0, 10)) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return null
  if (dob > today || dob < '1900-01-01') return null
  return calcKarmic(dob)
}
