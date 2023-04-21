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
  downPayment: number | undefined,
  minimumDownPayment: number | undefined,
  listPrice: number | undefined,
  primaryLoanAmount: number | undefined,
  secondaryLoanAmount: number | undefined,
  loanType: string | undefined,
  propertyType: string | undefined,
  loanLimit: number | undefined,
  budgetTest:number | undefined,
  equityPercentage: number | undefined
  loanViable: boolean | undefined
}

export interface OptimizedLoans {
  fha: OptimizedLoan
  conventional: OptimizedLoan
  piggy_back: OptimizedLoan
  jumbo: OptimizedLoan
}

export interface LoanLimitsObject {
  county_name: string;
  conventional: LoanLimit;
  fha: LoanLimit;
  [key: string]: LoanLimit | string;
}
export interface LoanLimit {
  [key: string]: number;
  one_unit: number,
  two_unit: number,
  three_unit: number,
  four_unit: number
}