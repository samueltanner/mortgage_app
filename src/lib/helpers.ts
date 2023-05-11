import { OptimizedLoans, OptimizedLoan } from "./types";

export const parsePrice = (
  price: number | undefined,
  symbol: boolean = false,
  cents: boolean = false,
) => {
  if (!price && price !== 0) return

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

export const getPercent = (num: number, denom: number) => {
  return Number(((num / denom) * 100).toFixed(2))
}

export const getRecurringPayment = ({
  loanAmount,
  interestRate,
  term,
  interestOnly = false,
}:{
  loanAmount: number
  interestRate: number
  term: number
  interestOnly?: boolean
}) => {
  const monthlyInterestRate = interestRate / 100 / 12
  const monthlyPayment =
    (monthlyInterestRate * loanAmount) /
    (1 - Math.pow(1 + monthlyInterestRate, -term))
  if (interestOnly) return monthlyInterestRate * loanAmount
  return monthlyPayment
}

export const getLoanString = (loanType: string) => {
  if (loanType === 'jumbo') return 'Jumbo'
  if (loanType === 'piggy_back') return 'Piggy Back'
  if (loanType === 'fha') return 'FHA'
  return 'Conventional'
}

export const getCheapestViableLoan = (optimizedLoans: OptimizedLoans) => {
  const options = ['conventional', 'fha', 'piggy_back', 'jumbo']
  const totalMonthlyPayment = (loan: OptimizedLoan) => {
    return (loan?.downPayment || 0) + (loan.primaryLoanPI || 0) + (loan.mortgageInsurance || 0) + (loan.secondaryLoanIO || 0)
  }
  const viableLoans = options.filter((loanType) => {
    return optimizedLoans[loanType].loanViable
  })
  const cheapestViableLoan = viableLoans.reduce((acc, loanType) => {
    if (totalMonthlyPayment(optimizedLoans[loanType]) < totalMonthlyPayment(optimizedLoans[acc])) {
      return loanType
    }
    return acc
  }, 'conventional')

  return cheapestViableLoan
}
