export const parsePrice = (
  price: number,
  symbol: boolean = false,
  cents: boolean = false,
) => {
  if (!price) return

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: symbol ? 'currency' : 'decimal',
    currency: 'USD',
    maximumFractionDigits: cents ? 2 : 0,
  })
  const result = formattedPrice.format(price);

  return result;
}
