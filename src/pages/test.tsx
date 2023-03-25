import { useGetCounties } from '@/lib/useGetCounties'
import { useState } from 'react'
import { states } from '@/lib/data'

const Test = ({}) => {
  const [state, setState] = useState<string>('')
  const { data, isLoading, error } = useGetCounties({
    state_abbr: state,
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
          data.counties.map((county) => {
            return (
              <option value={county} key={county.id}>
                {county.county_name}
              </option>
            )
          })}
      </select>
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
