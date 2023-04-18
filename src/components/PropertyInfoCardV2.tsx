import { useRef, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { County } from '../lib/types'
import { states } from '@/lib/data'

interface PropertyInfoCardProps {
  propertyExpanded: boolean
  listPrice: number
  setListPrice: (listPrice: number) => void
  setListingURL: (listingURL: string) => void
  setListingState: (listingState: string) => void
  setListingCounty: (listingCounty: string) => void
  setPropertyType: (propertyType: string) => void
  listingState: string
  listingCounty: string
  propertyType: string
  counties: County[]
}

export const PropertyInfoCard = ({
  propertyExpanded,
  listPrice,
  setListPrice,
  setListingURL,
  setListingState,
  setListingCounty,
  setPropertyType,
  listingState,
  listingCounty,
  propertyType,
  counties,
}: PropertyInfoCardProps) => {
  const urlInputRef = useRef<HTMLInputElement>(null)
  const handleSearchRedfinUrl = () => {
    if (!urlInputRef.current) return
    setListingURL(urlInputRef.current.value)
  }

  return (
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
                  <option value={state.abbreviation} key={state.abbreviation}>
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
  )
}
