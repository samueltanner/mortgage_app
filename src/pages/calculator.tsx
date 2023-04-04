import { CalculatorCard } from '@/components/CalculatorCard'
import { CardOverlayIcon } from '@/components/CardOverlayIcon'
import { useState, useRef, useEffect } from 'react'
import { BiSearch } from 'react-icons/bi'
import { useGetPropertyInfo } from '@/lib/useGetPropertyInfo'
import { useGetCounties } from '@/lib/useGetCounties'
import Image from 'next/image'
import { states } from '@/lib/data'

interface County {
  id: number
  county_name: string
  state_abbr: string
}

const Calculator = ({}) => {
  const [propertyExpanded, setPropertyExpanded] = useState<boolean>(true)
  const [listingState, setListingState] = useState<string>('')
  const [listingCounty, setListingCounty] = useState<string>('')
  const [listingURL, setListingURL] = useState<string>('')
  const [propertyType, setPropertyType] = useState<string>('')
  const [listPrice, setListPrice] = useState<number>()

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

  const urlInputRef = useRef<HTMLInputElement>(null)

  const handleSearchRedfinUrl = () => {
    if (!urlInputRef.current) return
    setListingURL(urlInputRef.current.value)
  }

  useEffect(() => {
    if (!propertyData) return
    setListPrice(propertyData.list_price)
    setListingState(propertyData.address?.state)
    setListingCounty(propertyData.address?.county.toUpperCase())
    getNumberOfUnits()
  }, [propertyData])

  useEffect(() => {
    if (propertyLoading) return handleReset()
  }, [])

  const getNumberOfUnits = () => {
    if (!propertyData || !propertyData.property_type) return
    const classification =
      propertyData.property_type?.classification?.toLowerCase()
    const units = propertyData.property_type.units
    if (['single family', 'condo'].includes(classification) || units === 1)
      return setPropertyType('Single Family')

    if (['duplex'].includes(classification) || units === 2) {
      return setPropertyType('Duplex')
    }

    if (['triplex'].includes(classification) || units === 3) {
      return setPropertyType('Triplex')
    }

    if (['quadruplex', 'fourplex'].includes(classification) || units === 4) {
      return setPropertyType('Fourplex')
    }

    setPropertyType('')
  }

  const handleReset = () => {
    setListingURL('')
    setListingState('')
    setListingCounty('')
    setPropertyType('')
    setListPrice(undefined)
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
                      type="text"
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
                      disabled={!counties?.length}
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
                    <option value={'Single Family'} key={1}>
                      Single Family
                    </option>
                    <option value={'Duplex'} key={2}>
                      Duplex
                    </option>
                    <option value={'Triplex'} key={3}>
                      Triplex
                    </option>
                    <option value={'Fourplex'} key={4}>
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
      <div className="flex flex-col ">
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
              {propertyType && <li>Property Type: {propertyType}</li>}
              {propertyData?.address?.street_address && (
                <li>
                  Address: {propertyData?.address?.street_address},{' '}
                  {listingState} {propertyData?.address?.zip_code}
                </li>
              )}
              {listingCounty && <li>County: {listingCounty}</li>}
              {propertyData?.property_type?.classification && (
                <li>
                  Classification: {propertyData?.property_type?.classification}
                </li>
              )}
              {propertyData?.property_type?.units && (
                <li>Units: {propertyData?.property_type?.units}</li>
              )}
            </ul>
          </div>
        </CalculatorCard>
      </div>
    </div>
  )
}

export default Calculator
