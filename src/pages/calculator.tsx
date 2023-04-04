import { CalculatorCard } from '@/components/CalculatorCard'
import { CardOverlayIcon } from '@/components/CardOverlayIcon'
import { useState, useRef, useEffect, useCallback } from 'react'
import { BiSearch, BiRightArrowAlt, BiSliderAlt, BiCheck } from 'react-icons/bi'
import { useGetPropertyInfo } from '@/lib/useGetPropertyInfo'
import { useGetCounties } from '@/lib/useGetCounties'
import { useGetLoanLimits } from '@/lib/useGetLoanLimits'
import Image from 'next/image'
import { states } from '@/lib/data'

interface County {
  id: number
  county_name: string
  state_abbr: string
}

interface LoanMaximums {
  fha_max: number
  conventional_max: number
}

interface OptimizedLoan {
  primaryLoanAmount: number
  secondaryLoanAmount: number | null
  downPayment: number
  equity: number
}

interface OptimizedLoans {
  fha: OptimizedLoan
  conventional: OptimizedLoan
}

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
  const [loanSettingsExpanded, setLoanSettingsExpanded] =
    useState<boolean>(false)
  const [FHAEligible, setFHAEligible] = useState<boolean>(true)
  const [piggyBackEligible, setPiggyBackEligible] = useState<boolean>(true)
  const [jumboEligible, setJumboEligible] = useState<boolean>(true)

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

  const urlInputRef = useRef<HTMLInputElement>(null)
  const downPaymentInputRef = useRef<HTMLInputElement>(null)

  const handleSearchRedfinUrl = () => {
    if (!urlInputRef.current) return
    setListingURL(urlInputRef.current.value)
  }

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

  const getLoanMaximums = useCallback(() => {
    if (propertyData) {
      const { loan_limits } = propertyData
      if (!loan_limits) return

      const { fha, conventional } = loan_limits
      if (!fha || !conventional) return

      if (!propertyType) return

      const fha_max = fha[propertyType]
      const conventional_max = conventional[propertyType]

      setLoanMaximums({
        fha_max: fha_max,
        conventional_max: conventional_max,
      })
    }

    if (loanLimits) {
      const { fha, conventional } = loanLimits
      if (!fha || !conventional) return

      if (!propertyType) return

      const fha_max = fha[propertyType]
      const conventional_max = conventional[propertyType]

      setLoanMaximums({
        fha_max: fha_max,
        conventional_max: conventional_max,
      })
    }
  }, [propertyData, propertyType, setLoanMaximums, loanLimits])

  useEffect(() => {
    if (!propertyData) return
    setListPrice(propertyData.list_price ?? 0)
    setListingState(propertyData.address?.state)
    setListingCounty(propertyData.address?.county.toUpperCase())
    getNumberOfUnits()
    getLoanMaximums()
  }, [propertyData, getLoanMaximums, getNumberOfUnits])

  useEffect(() => {
    if (!loanLimits) return
    return getLoanMaximums()
  }, [loanLimits, getLoanMaximums])

  useEffect(() => {
    if (!loanMaximums || !listPrice) return
    const fhaLoanTerms = getOptimizedLoanTerms(
      loanMaximums.fha_max,
      listPrice,
      'fha',
      downPayment ? downPayment : null,
    )
    const conventionalLoanTerms = getOptimizedLoanTerms(
      loanMaximums.conventional_max,
      listPrice,
      'conventional',
      downPayment ? downPayment : null,
    )
    const optimizedLoanObj = {
      fha: fhaLoanTerms,
      conventional: conventionalLoanTerms,
    }

    setOptimizedLoans(optimizedLoanObj)
  }, [loanMaximums, listPrice, downPayment])

  const propertyTypeName: {
    [key: string]: string
    one_unit: string
    two_unit: string
    three_unit: string
    four_unit: string
  } = {
    one_unit: 'Single Family',
    two_unit: 'Duplex',
    three_unit: 'Triplex',
    four_unit: 'Fourplex',
  }

  const handleReset = () => {
    setListingURL('')
    setListingState('')
    setListingCounty('')
    setPropertyType('')
    setLoanMaximums(undefined)
    setListPrice(0)
  }

  const getPercent = (num: number, denom: number) => {
    return Number(((num / denom) * 100).toFixed(2))
  }

  const getOptimizedLoanTerms = (
    loanMax: number,
    listPrice: number,
    loanType: string,
    customDownPaymentAmount?: number | null,
  ) => {
    const minPercentDown: {
      [key: string]: number
    } = {
      fha: 0.035,
      conventional: 0.03,
    }

    const getMinimumDownPayment = () => {
      let minDown = listPrice * minPercentDown[loanType]
      if (listPrice - loanMax > minDown) minDown = listPrice - loanMax
      return minDown
    }
    const minDown = Math.floor(getMinimumDownPayment())

    const customDownPossible = customDownPaymentAmount
      ? customDownPaymentAmount >= minDown
      : false

    return {
      primaryLoanAmount: customDownPossible
        ? listPrice - customDownPaymentAmount!
        : listPrice - minDown,
      downPayment: (customDownPossible && customDownPaymentAmount) || minDown,
      secondaryLoanAmount: null,
      equity: getPercent(
        (customDownPossible && customDownPaymentAmount) || minDown,
        listPrice,
      ),
    }
  }

  const handleCustomDownPayment = (downPayment: number) => {
    console.log(downPayment)
    setDownPayment(downPayment)
  }

  return (
    <div className="grid h-screen w-screen grid-cols-2 gap-8 bg-gray-50 p-10 text-slate-900">
      <div className="flex w-full flex-col gap-8">
        <CalculatorCard onClick={() => {}}>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon src={''} alt="sam" size="small" icon="home" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Property Info</h1>
            {propertyExpanded && (
              <div className="flex flex-col gap-2">
                <span className="flex items-end gap-4">
                  <span className="flex w-full flex-col">
                    <label htmlFor="redfin-url">RedFin URL</label>
                    <input
                      id="redfin-url"
                      type="text"
                      className="rounded-md border-2 border-slate-900 bg-gray-50 px-2"
                      ref={urlInputRef}
                    />
                  </span>
                  <button
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-md border-2 border-teal-400 bg-teal-400 duration-300 ease-in-out hover:bg-teal-200 "
                    onClick={() => {
                      handleSearchRedfinUrl()
                    }}
                  >
                    <BiSearch className="h-6 w-6" />
                  </button>
                </span>

                <span className="flex w-full items-center justify-center">
                  <hr className="mt-2 flex w-full border-slate-900" />
                </span>

                <span className="flex gap-2">
                  <span className="flex flex-col">
                    <label htmlFor="home-price">List Price</label>

                    <input
                      id="home-price"
                      type="number"
                      className="w-[60%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
                      value={listPrice}
                      onChange={(e) => {
                        setListPrice(Number(e.target.value))
                      }}
                    />
                  </span>
                </span>
                <span className="flex flex-wrap gap-2">
                  <span className="flex flex-col">
                    <label htmlFor="state-select">State</label>

                    <select
                      id="state-select"
                      className="rounded-md border-2 border-slate-900 bg-gray-50 px-1"
                      onChange={(e) => {
                        setListingState(e.target.value)
                      }}
                      value={listingState}
                    >
                      <option value={''} key={0} disabled>
                        ** State **
                      </option>
                      {states.map((state) => (
                        <option
                          value={state.abbreviation}
                          key={state.abbreviation}
                        >
                          {state.abbreviation}
                        </option>
                      ))}
                    </select>
                  </span>
                  <span className="flex flex-col">
                    <label htmlFor="county-select">County</label>

                    <select
                      id="county-select"
                      className="rounded-md border-2 border-slate-900 bg-gray-50 px-1"
                      onChange={(e) => {
                        setListingCounty(e.target.value)
                      }}
                      value={listingCounty}
                    >
                      <option value={''} key={0} disabled>
                        ** County **
                      </option>
                      {counties?.length > 0 &&
                        counties
                          ?.sort((a: County, b: County) =>
                            a.county_name.localeCompare(b.county_name),
                          )
                          .map((county: County) => (
                            <option value={county.county_name} key={county.id}>
                              {county.county_name}
                            </option>
                          ))}
                    </select>
                  </span>
                </span>
                <span className="flex flex-col">
                  <label htmlFor="property-type-select">Property Type</label>
                  <select
                    id="property-type-select"
                    className="w-fit rounded-md border-2 border-slate-900 bg-gray-50 px-1"
                    onChange={(e) => {
                      setPropertyType(e.target.value)
                    }}
                    value={propertyType}
                  >
                    <option value={''} key={0} disabled>
                      ** Property Type **
                    </option>
                    <option value={'one_unit'} key={1}>
                      Single Family
                    </option>
                    <option value={'two_unit'} key={2}>
                      Duplex
                    </option>
                    <option value={'three_unit'} key={3}>
                      Triplex
                    </option>
                    <option value={'four_unit'} key={4}>
                      Fourplex
                    </option>
                  </select>
                </span>
              </div>
            )}
          </div>
        </CalculatorCard>

        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="loan" />
          </span>
          <h1 className="text-xl font-bold">Loan Info</h1>
          <span className="flex gap-2">
            <span className="flex flex-col">
              <span className="flex w-fit items-end gap-4">
                <button
                  className={`my-2 flex h-10 w-10 flex-none items-center justify-center rounded-md border-2 ${
                    loanSettingsExpanded
                      ? 'border-teal-400 bg-teal-400 hover:bg-teal-200 '
                      : 'border-slate-900 bg-gray-300 hover:bg-gray-400'
                  }   duration-300 ease-in-out `}
                  onClick={() => {
                    setLoanSettingsExpanded(!loanSettingsExpanded)
                  }}
                >
                  <BiSliderAlt className="h-6 w-6" />
                </button>
                {loanSettingsExpanded && (
                  <div className="flex flex-col gap-2">
                    <span className="flex flex-col">
                      <label htmlFor="down-payment">Down Payment</label>
                      <input
                        id="down-payment"
                        type="number"
                        className="rounded-md border-2 border-slate-900 bg-gray-50 px-2"
                        ref={downPaymentInputRef}
                        value={downPayment || ''}
                        onChange={(e) => {
                          setDownPayment(Number(e.target.value))
                        }}
                      />
                    </span>
                    <span className="flex gap-2">
                      <button
                        id="fha-checkbox"
                        onClick={() => {
                          setFHAEligible(!FHAEligible)
                        }}
                      >
                        <div
                          className={`relative flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 border-slate-900 bg-gray-50 px-2
                      ${
                        FHAEligible
                          ? 'border-teal-800 bg-teal-400 hover:bg-teal-200 '
                          : 'border-slate-900 bg-gray-300 hover:bg-gray-400'
                      } duration-300 ease-in-out`}
                        >
                          {FHAEligible && (
                            <BiCheck className="absolute h-5 w-5" />
                          )}
                        </div>
                      </button>
                      <label htmlFor="fha-checkbox">
                        First-Time Home Buyer
                      </label>
                    </span>
                    <span className="flex gap-2">
                      <button
                        id="fha-checkbox"
                        onClick={() => {
                          setPiggyBackEligible(!piggyBackEligible)
                        }}
                      >
                        <div
                          className={`relative flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 border-slate-900 bg-gray-50 px-2
                      ${
                        piggyBackEligible
                          ? 'border-teal-800 bg-teal-400 hover:bg-teal-200 '
                          : 'border-slate-900 bg-gray-300 hover:bg-gray-400'
                      } duration-300 ease-in-out`}
                        >
                          {piggyBackEligible && (
                            <BiCheck className="absolute h-5 w-5" />
                          )}
                        </div>
                      </button>
                      <label htmlFor="fha-checkbox">
                        Show Piggy Loan Options
                      </label>
                    </span>
                    <span className="flex gap-2">
                      <button
                        id="fha-checkbox"
                        onClick={() => {
                          setJumboEligible(!jumboEligible)
                        }}
                      >
                        <div
                          className={`relative flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 border-slate-900 bg-gray-50 px-2
                      ${
                        jumboEligible
                          ? 'border-teal-800 bg-teal-400 hover:bg-teal-200 '
                          : 'border-slate-900 bg-gray-300 hover:bg-gray-400'
                      } duration-300 ease-in-out`}
                        >
                          {jumboEligible && (
                            <BiCheck className="absolute h-5 w-5" />
                          )}
                        </div>
                      </button>
                      <label htmlFor="fha-checkbox">
                        Show Jumbo Loan Options
                      </label>
                    </span>
                    {/* <input
                      type="checkbox"
                      name=""
                      id="fha-checkbox"
                      className="rounded-md border-2 border-slate-900 bg-gray-50 px-2"
                    /> */}
                  </div>
                )}
              </span>
            </span>
          </span>
          <span className="flex w-full items-center justify-center">
            <hr className="my-2 flex w-full border-slate-900" />
          </span>
          <div className="flex flex-col gap-2">
            <span className="flex flex-wrap gap-4">
              <span className="flex w-fit flex-col">
                <h2 className="font-bold">Conventional Mortgage</h2>
                <p>Loan Maximum: ${loanMaximums?.conventional_max}</p>
                <p>
                  Loan Amount: $
                  {optimizedLoans?.conventional?.primaryLoanAmount}
                </p>
                <p>
                  Down Payment: ${optimizedLoans?.conventional?.downPayment}
                </p>
                <p>Equity: {optimizedLoans?.conventional?.equity}%</p>
              </span>
              {FHAEligible && (
                <span className="flex w-fit flex-col">
                  <h2 className="font-bold">FHA Mortgage</h2>
                  <p>Loan Maximum: ${loanMaximums?.fha_max}</p>
                  <p>Loan Amount: ${optimizedLoans?.fha?.primaryLoanAmount}</p>
                  <p>Down Payment: ${optimizedLoans?.fha?.downPayment}</p>
                  <p>Equity: {optimizedLoans?.fha?.equity}%</p>
                </span>
              )}
            </span>
          </div>
        </CalculatorCard>

        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="closing" />
          </span>
          <h1 className="text-xl font-bold">Closing Costs & Fees</h1>
        </CalculatorCard>

        <CalculatorCard>
          <span className="absolute -top-4 -right-4">
            <CardOverlayIcon size="small" icon="income" />
          </span>
          <h1 className="text-xl font-bold">Income & Expenses</h1>
        </CalculatorCard>
      </div>
      <div className=" flex flex-col">
        <CalculatorCard>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Mortgage Breakdown</h1>
            {propertyData?.image && (
              <Image
                src={propertyData.image}
                width={500}
                height={500}
                alt="home image"
              />
            )}
            <ul>
              {listPrice && <li>List Price: ${listPrice}</li>}
              {propertyData?.address?.street_address && (
                <li>
                  Address: {propertyData?.address?.street_address},{' '}
                  {listingState} {propertyData?.address?.zip_code}
                </li>
              )}
              {listingCounty && <li>County: {listingCounty}</li>}
              {propertyType && (
                <li>Property Type: {propertyTypeName[propertyType]}</li>
              )}
              {propertyData?.property_type?.units && (
                <li># of Units: {propertyData?.property_type?.units}</li>
              )}
            </ul>
          </div>
        </CalculatorCard>
      </div>
    </div>
  )
}

export default Calculator
