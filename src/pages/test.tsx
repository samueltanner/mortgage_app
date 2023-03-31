import { useGetCounties } from '@/lib/useGetCounties'
import { useState } from 'react'
import { states } from '@/lib/data'
import { useGetPropertyInfo } from '@/lib/useGetPropertyInfo'

interface County {
  id: number
  county_name: string
  state_abbr: string
  state_name: string
}

const Test = ({}) => {
  const [state, setState] = useState<string>('')
  const [listingUrl, setListingUrl] = useState<string>('')
  const { data, isLoading, error } = useGetCounties({
    state_abbr: state,
  })

  const { data: propertyInfo } = useGetPropertyInfo({
    listing_url: listingUrl,
    get_loan_limits: true,
  })

  return (
    <>
      this is a test!
      <p>{state}</p>
      <select value={state} onChange={(e) => setState(e.target.value)}>
        {states.map((state) => {
          return (
            <option value={state.abbreviation} key={state.abbreviation}>
              {state.name}
            </option>
          )
        })}
      </select>
      <select>
        {data &&
          data.counties.map((county: County) => {
            return (
              <option value={county.county_name} key={county.id}>
                {county.county_name}
              </option>
            )
          })}
      </select>
      <input
        type="text"
        placeholder="Enter a redfin url"
        onChange={(e) => setListingUrl(e.target.value)}
      />
      {propertyInfo && (
        <div>
          <p>Property Info</p>
          {JSON.stringify(propertyInfo)}
        </div>
      )}
      {/* {isLoading && <p>loading...</p>} */}
      {/* {data && (
        <>
          <div>
            {data.counties.map((county) => {
              return <p key={county}>{county}</p>
            })}
          </div>
        </>
      )} */}
    </>
  )
}

export default Test
