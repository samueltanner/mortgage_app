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

 export const handlePriceChange = (value: string) => {
    let newValue = value.replace(/,/g, '')
    let parsedValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parsedValue
  }

  export const getCleanNumber = (price: string) => {
    return Number(price?.replace(/,/g, ''))
  }

  export const handleNumberInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.valueAsNumber;
    return newValue;
  };