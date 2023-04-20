import { LoanLimitsObject, LoanLimit } from "./types"
import { getPercent } from "./helpers"


interface OptimizedLoanProps {
  listPrice: number
  customDownPayment: number | undefined
  propertyType: string
  loanType: string
  loanLimits: LoanLimitsObject
}

export const getOptimizedLoan = ({
  listPrice,
  customDownPayment,
  propertyType,
  loanType,
  loanLimits,
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
    if (loanType === 'piggy_back') return listPrice * minPercentDown.piggy_back
    if (loanType === 'jumbo') return listPrice * minPercentDown.jumbo
    const minDownByPercent = listPrice * minPercentDown[loanType]
    const minDownByLoanLimit = listPrice - loanLimit
    const minDown = minDownByPercent > minDownByLoanLimit ? minDownByPercent : minDownByLoanLimit
    return Math.floor(minDown)
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
  const equity = getEquity()


  return {
    downPayment: downPayment || 0,
    minimumDownPayment: minimumDownPayment || 0,
    listPrice: listPrice || 0,
    primaryLoanAmount: primaryLoanAmount  || 0,
    secondaryLoanAmount: secondaryLoanAmount || 0,
    loanType: loanType,
    propertyType: propertyType || '',
    loanLimit: loanLimit || 0,
    budgetTest: listPrice - downPayment - primaryLoanAmount - secondaryLoanAmount,
    equityPercentage: equity || 0
  }

}

