import { LoanLimitsObject, LoanLimit } from "./types"
import { getPercent, getRecurringPayment } from "./helpers"


interface OptimizedLoanProps {
  listPrice: number
  customDownPayment: number | undefined
  propertyType: string
  loanType: string
  loanLimits: LoanLimitsObject
  interestRate: number | undefined
  secondaryInterestRate?: number | undefined
}

export const getOptimizedLoan = ({
  listPrice,
  customDownPayment,
  propertyType,
  loanType,
  loanLimits,
  interestRate,
  secondaryInterestRate
}: OptimizedLoanProps) => {
  let optimizedLoanObject = {
    downPayment: undefined,
    minimumDownPayment: undefined,
    listPrice: undefined,
    primaryLoanAmount: undefined,
    secondaryLoanAmount: undefined,
    loanType: undefined,
    propertyType: undefined,
    loanLimit: undefined,
    budgetTest: undefined,
    equityPercentage: undefined,
    loanViable: undefined,
    primaryLoanPI: undefined,
    secondaryLoanPI: undefined,
    secondaryLoanIO: undefined,
    mortgageInsurance: undefined
  }

  const minPercentDown: {
    [key: string]: number
  } = {
    fha: 0.035,
    conventional: 0.03,
    piggy_back: 0.1,
    jumbo: 0.15,
  }

  if (!loanLimits || !listPrice || !propertyType || !loanType) return optimizedLoanObject

  const loanCategory: 'fha' | 'conventional' = loanType === 'fha' ? 'fha' : 'conventional';
  const loanLimit = loanLimits[loanCategory][propertyType];

  const getMinimumDownPayment = () => {
    if (loanType === 'piggy_back') return Math.floor(listPrice * minPercentDown.piggy_back)
    if (loanType === 'jumbo') return Math.floor(listPrice * minPercentDown.jumbo)
    const minDownByPercent = listPrice * minPercentDown[loanType]
    const minDownByLoanLimit = listPrice - loanLimit
    const minDown = minDownByPercent > minDownByLoanLimit ? minDownByPercent : minDownByLoanLimit
    return Math.floor(minDown > 0 ? minDown : 0)
  }

  const minimumDownPayment = getMinimumDownPayment()

  const getDownPayment = () => {
    if(!customDownPayment || customDownPayment < minimumDownPayment) return minimumDownPayment
    if (customDownPayment > listPrice) return listPrice
    if (customDownPayment > minimumDownPayment) return customDownPayment
    return minimumDownPayment
  }

  const downPayment = getDownPayment()

  const getPrimaryLoanAmount = () => {
    const downPayment = getDownPayment()
    if (loanType === 'jumbo') return listPrice - downPayment
    const loanMax = loanLimit
    const maxPrimaryLoanAmount = listPrice - downPayment
    const primaryLoanAmount =
      maxPrimaryLoanAmount > loanMax ? loanMax : maxPrimaryLoanAmount
    return Math.floor(
      primaryLoanAmount > listPrice ? listPrice : primaryLoanAmount,
    )
  }

  const getSecondaryLoanAmount = () => {
    if (loanType !== 'piggy_back') return 0
    const primaryLoanAmount = getPrimaryLoanAmount()
    const downPayment = getDownPayment()
    return Math.floor(listPrice - primaryLoanAmount - downPayment)
  }

  const getEquity = () => {
    const downPayment = getDownPayment()
    if (loanType === 'piggy_back') {
      const secondaryLoanAmount = getSecondaryLoanAmount()
      const totalDown = downPayment + secondaryLoanAmount
      const equity = getPercent(totalDown, listPrice) || 0
      return equity
    }
    const equity = getPercent(downPayment, listPrice) || 0
    return equity
  }

  const primaryLoanAmount = getPrimaryLoanAmount()
  const secondaryLoanAmount = getSecondaryLoanAmount()
  const budgetTest = listPrice - downPayment - primaryLoanAmount - secondaryLoanAmount
  const equity = getEquity()

  const getLoanViability = () => {
    if((loanType === 'jumbo' || loanType === 'piggy_back') && listPrice < loanLimit) return false
    if (loanType === 'piggy_back' && secondaryLoanAmount <= 0) return false
    if (budgetTest !== 0) return false
    if (!customDownPayment) return true
    return customDownPayment < minimumDownPayment ? false : true
  }

  const loanViable = getLoanViability()

  const getPrimaryLoanMonthlyPrincipalAndInterest = () => {
    const term = 30*12
    const monthlyPayment = getRecurringPayment({loanAmount:primaryLoanAmount, interestRate: interestRate || 0, term})
    return Math.floor(monthlyPayment)
  }

  const getSecondaryLoanMonthlyInterest = () => {
    const term = 10*12
    const monthlyPayment = getRecurringPayment({loanAmount:secondaryLoanAmount, interestRate: secondaryInterestRate || 0, term, interestOnly: true})
    return Math.floor(monthlyPayment)
  }

  const getSecondaryLoanMonthlyPrincipalAndInterest = () => {
    const term = 10*12
    const monthlyPayment = getRecurringPayment({loanAmount:secondaryLoanAmount, interestRate: secondaryInterestRate || 0, term, interestOnly: false})
    return Math.floor(monthlyPayment)
  }

  const getMortgageInsurance = () => {
    if (loanType === 'fha') return Math.floor(primaryLoanAmount * 0.01/12)
    if (equity < 20) return Math.floor(primaryLoanAmount * 0.01/12)
  }

  const primaryLoanPI = getPrimaryLoanMonthlyPrincipalAndInterest()
  const secondaryLoanPI = getSecondaryLoanMonthlyPrincipalAndInterest()
  const secondaryLoanInterest = getSecondaryLoanMonthlyInterest()
  const mortgageInsurance = getMortgageInsurance()


  return {
    downPayment: downPayment || 0,
    minimumDownPayment: minimumDownPayment || 0,
    listPrice: listPrice || 0,
    primaryLoanAmount: primaryLoanAmount  || 0,
    secondaryLoanAmount: secondaryLoanAmount || 0,
    loanType: loanType,
    propertyType: propertyType || '',
    loanLimit: loanLimit || 0,
    budgetTest: budgetTest || 0,
    equityPercentage: equity || 0,
    loanViable: loanViable || false,
    primaryLoanPI: primaryLoanPI || 0,
    secondaryLoanPI: secondaryLoanPI || 0,
    secondaryLoanIO: secondaryLoanInterest || 0,
    mortgageInsurance: mortgageInsurance || 0
  }

}

