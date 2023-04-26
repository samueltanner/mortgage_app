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
  primaryLoanPI: number | undefined
  secondaryLoanPI: number | undefined
  secondaryLoanIO: number | undefined
  mortgageInsurance: number | undefined
}

export interface OptimizedLoans {
  [key: string] : OptimizedLoan
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

export interface InterestRates {
  [key: string]: number | undefined
  conventional: number | undefined
  fha: number| undefined
  jumbo: number| undefined
  piggy_back: number| undefined
  va: number| undefined
}

export interface CashflowObject {
  [key: string]: number | undefined
  monthly_household_income: number
  monthly_household_expenses: number
  rental_income: number
  property_taxes: number
  homeowners_insurance: number
  hoa_fees: number
  mortgage_insurance: number
  utilities: number
  principal_and_interest: number
  household_maintenance: number
}