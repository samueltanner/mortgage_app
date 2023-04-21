import { CalculatorCard } from '@/components/CalculatorCard'
import { CardOverlayIcon } from '@/components/CardOverlayIcon'
import { useState, useEffect, useCallback } from 'react'
import { useGetPropertyInfo } from '@/lib/useGetPropertyInfo'
import { useGetCounties } from '@/lib/useGetCounties'
import { useGetLoanLimits } from '@/lib/useGetLoanLimits'
import {
  InterestRates,
  LoanMaximums,
  OptimizedLoan,
  OptimizedLoans,
} from '@/lib/types'
import { PropertyInfoCard } from '@/components/PropertyInfoCardV2'
import { LoanInfoCard } from '@/components/LoanInfoCardV2'
import { MortgageInfoCard } from '@/components/MortgageInfoCard'
import { IncomeAndExpensesCard } from '@/components/IncomeAndExpensesCard'
import { getOptimizedLoan } from '@/lib/optimizeLoanHelper'
import { useTodaysInterestRates } from '@/lib/useTodaysInterestRates'

const Calculator = ({}) => {
  const [propertyExpanded, setPropertyExpanded] = useState<boolean>(true)
  const [listingState, setListingState] = useState<string>('')
  const [listingCounty, setListingCounty] = useState<string>('')
  const [listingURL, setListingURL] = useState<string>('')
  const [propertyType, setPropertyType] = useState<string>('')
  const [listPrice, setListPrice] = useState<number>(0)
  const [downPayment, setDownPayment] = useState<number>()
  const [optimizedLoans, setOptimizedLoans] = useState<OptimizedLoans>()
  const [interestRates, setInterestRates] = useState<InterestRates>({
    conventional: undefined,
    fha: undefined,
    jumbo: undefined,
    piggy_back: undefined,
    va: undefined,
  })

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

  const {
    data: todaysInterestRates,
    error: todaysInterestRatesError,
    isLoading: todaysInterestRatesLoading,
    isSuccess: todaysInterestRatesSuccess,
  } = useTodaysInterestRates()

  useEffect(() => {
    if (todaysInterestRates) setInterestRates(todaysInterestRates)
  }, [todaysInterestRates])

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
    if (propertyData) {
      getNumberOfUnits()
      setListingCounty(propertyData.address.county)
      setListingState(propertyData.address.state)
      setListPrice(propertyData.list_price)
    }
  }, [propertyData, propertySuccess, propertyLoading])

  useEffect(() => {
    if (!loanLimits || !listPrice || !propertyType) return

    const optimizedFHA: OptimizedLoan = getOptimizedLoan({
      listPrice,
      customDownPayment: downPayment,
      loanLimits,
      propertyType,
      loanType: 'fha',
      interestRate: interestRates?.fha,
    })
    const optimizedConventional = getOptimizedLoan({
      listPrice,
      customDownPayment: downPayment,
      loanLimits,
      propertyType,
      loanType: 'conventional',
      interestRate: interestRates?.conventional,
    })
    const optimizedPiggyback = getOptimizedLoan({
      listPrice,
      customDownPayment: downPayment,
      loanLimits,
      propertyType,
      loanType: 'piggy_back',
      interestRate: interestRates?.conventional,
      secondaryInterestRate: interestRates?.piggy_back,
    })
    const optimizedJumbo = getOptimizedLoan({
      listPrice,
      customDownPayment: downPayment,
      loanLimits,
      propertyType,
      loanType: 'jumbo',
      interestRate: interestRates?.jumbo,
    })

    const optimizedLoans = {
      fha: optimizedFHA,
      conventional: optimizedConventional,
      piggy_back: optimizedPiggyback,
      jumbo: optimizedJumbo,
    }

    setOptimizedLoans(optimizedLoans)
  }, [loanLimits, downPayment, listPrice, propertyType])

  return (
    <div className="grid h-screen w-screen grid-cols-5 gap-8 overflow-y-scroll bg-gray-50 p-6 text-slate-900">
      <div className="col-span-3 flex w-full flex-col gap-8 pt-2">
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

        {/* Loan  Info Card */}
        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="loan" />
          </span>
          <LoanInfoCard
            optimizedLoans={optimizedLoans}
            setDownPayment={setDownPayment}
            interestRates={interestRates}
          />
        </CalculatorCard>

        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="income" />
          </span>
          <IncomeAndExpensesCard />
        </CalculatorCard>

        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="closing" />
          </span>
          <h1 className="text-xl font-bold">Closing Costs & Fees</h1>
        </CalculatorCard>
      </div>
      <div className=" col-span-2 flex flex-col">
        <div className="sticky top-0">
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
    </div>
  )
}

export default Calculator
