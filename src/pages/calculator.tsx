import { CalculatorCard } from '@/components/CalculatorCard'
import { CardOverlayIcon } from '@/components/CardOverlayIcon'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useGetPropertyInfo } from '@/lib/useGetPropertyInfo'
import { useGetCounties } from '@/lib/useGetCounties'
import { useGetLoanLimits } from '@/lib/useGetLoanLimits'
import {
  CashflowObject,
  ClosingCosts,
  InterestRates,
  OptimizedLoan,
  OptimizedLoans,
} from '@/lib/types'
import { PropertyInfoCard } from '@/components/PropertyInfoCardV2'
import { LoanInfoCard } from '@/components/LoanInfoCardV2'
import { MortgageInfoCard } from '@/components/MortgageInfoCard'
import { IncomeAndExpensesCard } from '@/components/IncomeAndExpensesCard'
import { getOptimizedLoan } from '@/lib/optimizeLoanHelper'
import { useTodaysInterestRates } from '@/lib/useTodaysInterestRates'
import { ClosingCostsAndFeesCard } from '@/components/ClosingCostsAndFeesCard'
import { getCheapestViableLoan } from '@/lib/helpers'
import { propertyTypeMultiplier } from '@/lib/helpers'

const Calculator = ({}) => {
  const [propertyExpanded, setPropertyExpanded] = useState<boolean>(true)
  const [listingState, setListingState] = useState<string>('')
  const [listingCounty, setListingCounty] = useState<string>('')
  const [listingURL, setListingURL] = useState<string>('')
  const [propertyType, setPropertyType] = useState<string>('')
  const [listPrice, setListPrice] = useState<number>(0)
  const [offerPrice, setOfferPrice] = useState<number | null>(null)
  const [downPayment, setDownPayment] = useState<number>()
  const [optimizedLoans, setOptimizedLoans] = useState<OptimizedLoans>()
  const [interestRates, setInterestRates] = useState<InterestRates>({
    conventional: undefined,
    fha: undefined,
    jumbo: undefined,
    piggy_back: undefined,
    va: undefined,
  })
  const [monthlyCashflowObj, setMonthlyCashflowObj] = useState<CashflowObject>({
    monthly_household_income: 0,
    monthly_household_expenses: 0,
    rental_income: 0,
    property_taxes: 0,
    homeowners_insurance: 0,
    hoa_fees: 0,
    mortgage_insurance: 0,
    utilities: 0,
    principal_and_interest: 0,
    household_maintenance: 0,
  })
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)
  const [closingCosts, setClosingCosts] = useState<ClosingCosts>({
    sellers_credit: 0,
    appraisal: 0,
    inspection: 0,
    lending_fees: 0,
  })

  const {
    data: propertyData,
    error: propertyError,
    isLoading: propertyLoading,
    isSuccess: propertySuccess,
    isError: propertyIsError,
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

  const totalCashflow = useMemo(() => {
    const totalIncome =
      monthlyCashflowObj.monthly_household_income +
      monthlyCashflowObj.rental_income

    const totalExpenses =
      monthlyCashflowObj.monthly_household_expenses +
      monthlyCashflowObj.property_taxes +
      monthlyCashflowObj.principal_and_interest +
      monthlyCashflowObj.hoa_fees +
      monthlyCashflowObj.utilities +
      monthlyCashflowObj.homeowners_insurance

    return {
      totalIncome,
      totalExpenses,
      totalCashflow: totalIncome - totalExpenses,
    }
  }, [monthlyCashflowObj])

  const getNumberOfUnits = useCallback(() => {
    if (!propertyData || !propertyData.property_type) return

    const classification =
      propertyData.property_type?.classification?.toLowerCase()
    const units = propertyData.property_type.units

    if (['single family', 'condo'].includes(classification) || units === 1) {
      setPropertyType('one_unit')
      return 'one_unit'
    }

    if (['duplex'].includes(classification) || units === 2) {
      setPropertyType('two_unit')
      return 'two_unit'
    }

    if (['triplex'].includes(classification) || units === 3) {
      setPropertyType('three_unit')
      return 'three_unit'
    }

    if (['quadruplex', 'fourplex'].includes(classification) || units === 4) {
      setPropertyType('four_unit')
      return 'four_unit'
    }

    setPropertyType('')
  }, [propertyData])

  useEffect(() => {
    if (propertyData) {
      const numUnits = getNumberOfUnits()
      setListingCounty(propertyData.address.county)
      setListingState(propertyData.address.state)
      setListPrice(propertyData.list_price)
      const newCashflowObj = {
        ...monthlyCashflowObj,
        rental_income: 0,
        hoa_fees: 0,
      }
      const utilities = propertyTypeMultiplier(numUnits || 'one_unit', 400)
      const householdMaintenance = propertyTypeMultiplier(
        numUnits || 'one_unit',
        (propertyData.sqft * 1) / 12,
      )
      newCashflowObj.utilities = utilities
      newCashflowObj.household_maintenance = householdMaintenance

      setMonthlyCashflowObj(newCashflowObj)
    }
  }, [propertyData, propertySuccess, propertyLoading])

  useEffect(() => {
    if (!loanLimits || !listPrice || !propertyType) return

    const optimizedFHA: OptimizedLoan = getOptimizedLoan({
      listPrice: offerPrice || listPrice,
      customDownPayment: downPayment,
      loanLimits,
      propertyType,
      loanType: 'fha',
      interestRate: interestRates?.fha,
    })
    const optimizedConventional = getOptimizedLoan({
      listPrice: offerPrice || listPrice,
      customDownPayment: downPayment,
      loanLimits,
      propertyType,
      loanType: 'conventional',
      interestRate: interestRates?.conventional,
    })
    const optimizedPiggyback = getOptimizedLoan({
      listPrice: offerPrice || listPrice,
      customDownPayment: downPayment,
      loanLimits,
      propertyType,
      loanType: 'piggy_back',
      interestRate: interestRates?.conventional,
      secondaryInterestRate: interestRates?.piggy_back,
    })
    const optimizedJumbo = getOptimizedLoan({
      listPrice: offerPrice || listPrice,
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
  }, [loanLimits, downPayment, listPrice, propertyType, offerPrice])

  useEffect(() => {
    if (!optimizedLoans) return
    const cheapestViable = getCheapestViableLoan(optimizedLoans)
    setSelectedLoan(cheapestViable)
  }, [optimizedLoans])

  const handleUpdateClosingCosts = (updates: Record<string, number>) => {
    const newClosingCostsObj = { ...closingCosts, ...updates }
    setClosingCosts(newClosingCostsObj)
  }

  useEffect(() => {
    let updates = {
      sellers_credit: closingCosts.sellers_credit,
      inspection: closingCosts.inspection,
      appraisal: closingCosts.appraisal,
      lending_fees: closingCosts.lending_fees,
    }

    if (propertyType) {
      updates['inspection'] = propertyTypeMultiplier(propertyType, 350)
      updates['appraisal'] = propertyTypeMultiplier(propertyType, 350)
    }

    if (optimizedLoans && selectedLoan) {
      updates['lending_fees'] = Math.floor(
        optimizedLoans[selectedLoan].primaryLoanAmount! * 0.02,
      )
    }

    handleUpdateClosingCosts(updates)
  }, [propertyType, optimizedLoans, selectedLoan])

  const getCashToClose = (): number => {
    let dp = 0
    if (optimizedLoans && selectedLoan) {
      dp = optimizedLoans[selectedLoan].downPayment || 0
    }

    const totalCosts =
      closingCosts.inspection +
      closingCosts.appraisal +
      closingCosts.lending_fees +
      dp

    const cashToClose =
      totalCosts - closingCosts.sellers_credit >= 0
        ? totalCosts - closingCosts.sellers_credit
        : 0

    return cashToClose
  }

  return (
    <div className="grid h-screen w-screen select-none grid-cols-5 gap-8 overflow-y-scroll bg-gray-50 p-6 text-slate-900">
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
            propertyIsError={propertyIsError}
            propertyLoading={propertyLoading}
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
            selectedLoan={selectedLoan}
            setSelectedLoan={setSelectedLoan}
            downPayment={downPayment}
            offerPrice={offerPrice}
            setOfferPrice={setOfferPrice}
            listPrice={listPrice}
          />
        </CalculatorCard>

        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="income" />
          </span>
          <IncomeAndExpensesCard
            monthlyCashflowObj={monthlyCashflowObj}
            setMonthlyCashflowObj={setMonthlyCashflowObj}
            optimizedLoans={optimizedLoans}
            selectedLoan={selectedLoan}
            propertyData={propertyData}
            totalCashflow={totalCashflow}
          />
        </CalculatorCard>

        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="closing" />
          </span>
          <h1 className="text-xl font-bold">Closing Costs & Fees</h1>
          <ClosingCostsAndFeesCard
            closingCosts={closingCosts}
            handleUpdateClosingCosts={handleUpdateClosingCosts}
            getCashToClose={getCashToClose}
            downPayment={
              (optimizedLoans &&
                selectedLoan &&
                optimizedLoans[selectedLoan]?.downPayment) ||
              0
            }
            offerPrice={offerPrice || listPrice}
          />
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
              propertyLoading={propertyLoading}
              offerPrice={offerPrice}
            />
          </CalculatorCard>
        </div>
      </div>
    </div>
  )
}

export default Calculator
