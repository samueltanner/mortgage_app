export interface County {
  id: string
  state_abr: string
  state: string
  county_code: number
  county: string
  median: number
  gse_1: number
  gse_2: number
  gse_3: number
  gse_4: number
  limit_type: string
  fha_1: number
  fha_2: number
  fha_3: number
  fha_4: number
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