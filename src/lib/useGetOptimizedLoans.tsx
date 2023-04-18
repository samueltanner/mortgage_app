import { useGetLoanLimits } from './useGetLoanLimits'
import { getPercent } from './helpers'

interface useGetOptimizedLoansProps {
  listPrice: number | undefined
  customDownPayment?: number | null
  state_abbr: string
  county_name: string
  property_type: string
}

export const useGetOptimizedLoans = ({
  listPrice,
  customDownPayment,
  state_abbr,
  county_name,
  property_type,
}: useGetOptimizedLoansProps) => {
  const {
    data: loanLimits,
    error: loanLimitsError,
    isLoading: loanLimitsLoading,
    isSuccess: loanLimitsSuccess,
  } = useGetLoanLimits({
    state_abbr: state_abbr,
    county_name: county_name,
  })

  console.log('loanLimits', loanLimits)

  const minPercentDown: {
    [key: string]: number
  } = {
    fha: 0.035,
    conventional: 0.03,
    piggy_back: 0.1,
    jumbo: 0.15,
  }

  const getDownPayment = (loanType: string) => {
    if (
      !loanLimits ||
      !property_type ||
      !state_abbr ||
      !county_name ||
      !listPrice
    )
      return customDownPayment || 0
    let downPayment = 0

    if (loanType === 'piggy_back') {
      downPayment = listPrice * minPercentDown.piggy_back
      return Math.floor(
        customDownPayment && customDownPayment >= downPayment
          ? customDownPayment
          : downPayment,
      )
    }

    if (loanType === 'jumbo') {
      downPayment = listPrice * minPercentDown.jumbo
      return Math.floor(
        customDownPayment && customDownPayment >= downPayment
          ? customDownPayment
          : downPayment,
      )
    }

    let minDown = listPrice * minPercentDown[loanType]
    const loanCategory = loanType === 'fha' ? 'fha' : 'conventional'
    const loanMax = loanLimits[loanCategory][property_type]
    if (listPrice - loanMax > minDown) {
      minDown = listPrice - loanMax
      downPayment = minDown
    }
    downPayment =
      customDownPayment && customDownPayment >= minDown
        ? customDownPayment
        : minDown

    return Math.floor(downPayment > listPrice ? listPrice : downPayment)
  }

  const getPrimaryLoanAmount = (loanType: string) => {
    if (
      !loanLimits ||
      !property_type ||
      !state_abbr ||
      !county_name ||
      !listPrice
    )
      return 0
    const downPayment = getDownPayment(loanType) || 0
    const loanCategory = loanType === 'fha' ? 'fha' : 'conventional'
    const loanMax = loanLimits[loanCategory][property_type]
    const maxPrimaryLoanAmount = listPrice - downPayment
    const primaryLoanAmount =
      maxPrimaryLoanAmount > loanMax ? loanMax : maxPrimaryLoanAmount
    return Math.floor(
      primaryLoanAmount > listPrice ? listPrice : primaryLoanAmount,
    )
  }

  const getSecondaryLoanAmount = (loanType: string) => {
    if (
      !loanLimits ||
      !property_type ||
      !state_abbr ||
      !county_name ||
      !listPrice
    )
      return
    if (loanType !== 'piggy_back') return 0
    const primaryLoanAmount = getPrimaryLoanAmount('piggy_back') || 0
    const downPayment = getDownPayment('piggy_back') || 0
    return Math.floor(listPrice - primaryLoanAmount - downPayment)
  }

  const getEquity = (loanType: string) => {
    if (!loanLimits || !listPrice) return
    const downPayment = getDownPayment(loanType) || 0
    if (loanType === 'piggy_back') {
      const secondaryLoanAmount = getSecondaryLoanAmount('piggy_back') || 0
      const totalDown = downPayment + secondaryLoanAmount
      const equity = getPercent(totalDown, listPrice) || 0
      return equity
    }
    const equity = getPercent(downPayment, listPrice) || 0
    return equity
  }

  const optimizedLoans = {
    fha: {
      loanLimit: loanLimits?.fha[property_type],
      primaryLoanAmount: getPrimaryLoanAmount('fha'),
      downPayment: getDownPayment('fha'),
      secondaryLoanAmount: getSecondaryLoanAmount('fha'),
      equity: getEquity('fha'),
    },
    conventional: {
      loanLimit: loanLimits?.conventional[property_type],
      primaryLoanAmount: getPrimaryLoanAmount('conventional'),
      downPayment: getDownPayment('conventional'),
      secondaryLoanAmount: getSecondaryLoanAmount('conventional'),
      equity: getEquity('conventional'),
    },
    piggy_back: {
      loanLimit: loanLimits?.conventional[property_type],
      primaryLoanAmount: getPrimaryLoanAmount('piggy_back'),
      downPayment: getDownPayment('piggy_back'),
      secondaryLoanAmount: getSecondaryLoanAmount('piggy_back'),
      equity: getEquity('piggy_back'),
    },
    jumbo: {
      loanLimit: undefined,
      primaryLoanAmount: getPrimaryLoanAmount('jumbo'),
      downPayment: getDownPayment('jumbo'),
      secondaryLoanAmount: getSecondaryLoanAmount('jumbo'),
      equity: getEquity('jumbo'),
    },
  }

  return optimizedLoans
}
