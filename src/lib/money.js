// Prices are integers in minor units (cents), e.g. 2775 -> "SGD 27.75".
export function formatMoney(minor, currency = 'SGD') {
  return `${currency} ${(minor / 100).toFixed(2)}`
}
