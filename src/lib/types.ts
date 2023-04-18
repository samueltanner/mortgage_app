export interface County {
  id: number
  county_name: string
  state_abbr: string
}

export interface State {
  name: string
  abbreviation: string
}

export interface CustomProps {
  customMortgageInsurance: boolean
  customHomeOwnersInsurance: boolean
  customPropertyTax: boolean
}

export interface LoanMaximums {
  fha_max: number
  conventional_max: number
}

export interface OptimizedLoan {
  primaryLoanAmount: number | undefined
  secondaryLoanAmount: number | undefined
  downPayment: number | undefined
  equity: number | undefined
}

export interface OptimizedLoans {
  fha: OptimizedLoan | undefined
  conventional: OptimizedLoan | undefined
  piggy_back: OptimizedLoan | undefined
  jumbo: OptimizedLoan | undefined
}