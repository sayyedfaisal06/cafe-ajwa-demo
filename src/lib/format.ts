/* Prices in whole rupees, grouped the Indian way, such as ₹1,180. */
export function formatPrice(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}
