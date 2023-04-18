import { CalculatorCard } from '@/components/CalculatorCard'
import { CardOverlayIcon } from '@/components/CardOverlayIcon'
import { useState, useEffect, useCallback } from 'react'
import { useGetPropertyInfo } from '@/lib/useGetPropertyInfo'
import { useGetCounties } from '@/lib/useGetCounties'
import { useGetLoanLimits } from '@/lib/useGetLoanLimits'
import { getPercent } from '@/lib/helpers'
import { LoanMaximums, OptimizedLoans } from '@/lib/types'
import { PropertyInfoCard } from '@/components/PropertyInfoCardV2'
import { LoanInfoCard } from '@/components/LoanInfoCardV2'
import { MortgageInfoCard } from '@/components/MortgageInfoCard'
import { IncomeAndExpensesCard } from '@/components/IncomeAndExpensesCard'
import { useGetOptimizedLoans } from '@/lib/useGetOptimizedLoans'

const Calculator = ({}) => {
  const [propertyExpanded, setPropertyExpanded] = useState<boolean>(true)
  const [listingState, setListingState] = useState<string>('')
  const [listingCounty, setListingCounty] = useState<string>('')
  const [listingURL, setListingURL] = useState<string>('')
  const [propertyType, setPropertyType] = useState<string>('')
  const [listPrice, setListPrice] = useState<number>(0)
  const [loanMaximums, setLoanMaximums] = useState<LoanMaximums>()
  const [downPayment, setDownPayment] = useState<number>(0)
  const [optimizedLoans, setOptimizedLoans] = useState<OptimizedLoans>()

  const {
    data: propertyData,
    error: propertyError,
    isLoading: propertyLoading,
    isSuccess: propertySuccess,
  } = useGetPropertyInfo({
    listing_url: listingURL,
    get_loan_limits: true,
  })
  const {
    data: counties,
    error: countiesError,
    isLoading: countiesLoading,
    isSuccess: countiesSuccess,
  } = useGetCounties({ state_abbr: listingState })

  const {
    data: loanLimits,
    error: loanLimitsError,
    isLoading: loanLimitsLoading,
    isSuccess: loanLimitsSuccess,
  } = useGetLoanLimits({
    state_abbr: listingState,
    county_name: listingCounty,
  })

  const optimizedLoansObj = useGetOptimizedLoans({
    listPrice: listPrice,
    customDownPayment: downPayment,
    state_abbr: listingState,
    county_name: listingCounty,
    property_type: propertyType,
  })

  const getNumberOfUnits = useCallback(() => {
    if (!propertyData || !propertyData.property_type) return

    const classification =
      propertyData.property_type?.classification?.toLowerCase()
    const units = propertyData.property_type.units

    if (['single family', 'condo'].includes(classification) || units === 1) {
      setPropertyType('one_unit')
      return
    }

    if (['duplex'].includes(classification) || units === 2) {
      setPropertyType('two_unit')
      return
    }

    if (['triplex'].includes(classification) || units === 3) {
      setPropertyType('three_unit')
      return
    }

    if (['quadruplex', 'fourplex'].includes(classification) || units === 4) {
      setPropertyType('four_unit')
      return
    }

    setPropertyType('')
  }, [propertyData])

  useEffect(() => {
    console.log(propertyData)
    if (propertyData) {
      getNumberOfUnits()
      setListingCounty(propertyData.address.county)
      setListingState(propertyData.address.state)
      setListPrice(propertyData.list_price)
    }
  }, [propertyData])

  useEffect(() => {
    setListingCounty('')
    setPropertyType('')
  }, [listingState])

  useEffect(() => {
    setOptimizedLoans(optimizedLoansObj)
  }, [loanMaximums, listPrice, downPayment, propertyType])

  return (
    <div className="grid h-screen w-screen grid-cols-2 gap-8 overflow-y-scroll bg-gray-50 p-10 text-slate-900">
      <div className="flex w-full flex-col gap-8">
        {/* Property Info Card */}
        <CalculatorCard onClick={() => {}}>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon src={''} alt="sam" size="small" icon="home" />
          </span>
          <PropertyInfoCard
            propertyExpanded={propertyExpanded}
            listPrice={listPrice}
            setListPrice={setListPrice}
            setListingURL={setListingURL}
            setListingState={setListingState}
            setListingCounty={setListingCounty}
            setPropertyType={setPropertyType}
            listingState={listingState}
            listingCounty={listingCounty}
            propertyType={propertyType}
            counties={counties}
          />
        </CalculatorCard>

        {/* <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="income" />
          </span>
          <IncomeAndExpensesCard />
        </CalculatorCard> */}

        {/* Loan  Info Card */}
        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="loan" />
          </span>
          <LoanInfoCard
            optimizedLoans={optimizedLoans}
            downPayment={downPayment}
            setDownPayment={setDownPayment}
            loanMaximums={loanMaximums}
          />
        </CalculatorCard>

        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="closing" />
          </span>
          <h1 className="text-xl font-bold">Closing Costs & Fees</h1>
        </CalculatorCard>
      </div>
      <div className=" flex flex-col">
        <CalculatorCard>
          <MortgageInfoCard
            propertyData={propertyData}
            listPrice={listPrice}
            listingState={listingState}
            listingCounty={listingCounty}
            propertyType={propertyType}
          />
        </CalculatorCard>
      </div>
    </div>
  )
}

export default Calculator
