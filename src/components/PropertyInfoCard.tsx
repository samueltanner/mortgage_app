import { County, State } from '@/lib/types'
import { parsePrice, handlePriceChange, getCleanNumber } from '@/lib/helpers'
import { CustomProps } from '@/lib/types'

interface PropertyInfoCardProps {
  selectedState: string | undefined
  setSelectedState: (state: string) => void
  states: State[]
  counties: County[] | undefined
  selectedCounty: County | undefined
  setSelectedCounty: (county: County | undefined) => void
  homePrice: string
  setHomePrice: (price: string) => void
  propertyType: number
  setPropertyType: (type: number) => void
  setCustomProps: (props: CustomProps) => void
  defaultCustomProps: CustomProps
}
export const PropertyInfoCard = ({
  selectedState,
  setSelectedState,
  states,
  counties,
  selectedCounty,
  setSelectedCounty,
  homePrice,
  setHomePrice,
  propertyType,
  setPropertyType,
  setCustomProps,
  defaultCustomProps,
}: PropertyInfoCardProps) => {
  const resetPropertyVars = () => {
    setSelectedState('initial')
    setSelectedCounty(undefined)
    setHomePrice('')
    setPropertyType(1)
    setCustomProps(defaultCustomProps)
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <span className="flex gap-2">
        <p className="text-2xl font-bold">Property Info</p>
        <button
          className="mt-1 h-fit w-fit border-2 px-2"
          onClick={() => {
            resetPropertyVars()
          }}
        >
          Reset
        </button>
      </span>

      <span className="flex gap-2">
        <label htmlFor="state">State</label>
        <select
          id="state"
          onChange={(e) => {
            setSelectedState(e.target.value)
          }}
          value={selectedState}
        >
          <option disabled value={'initial'}>
            Select State
          </option>
          {states.map((state) => (
            <option key={state.name} value={state.abbreviation}>
              {state.name} ({state.abbreviation})
            </option>
          ))}
        </select>
      </span>
      {selectedState !== 'initial' && (
        <span className="flex gap-2">
          <label htmlFor="county">County/Region</label>
          <select
            id="county"
            onChange={(e) => {
              const selectedCounty = counties?.find(
                (county) => county.id === Number(e.target.value),
              )
              setSelectedCounty(selectedCounty)
            }}
            value={selectedCounty?.id}
          >
            {/* <option disabled value="initial">
              Select Region
            </option> */}
            {counties?.map((county) => (
              <option key={county.id} value={county.id}>
                {county.county_name}
              </option>
            ))}
          </select>
        </span>
      )}
      <span className="flex gap-2">
        <label htmlFor="price">Home Price</label>
        $
        <input
          id="price"
          placeholder={
            selectedCounty && parsePrice(selectedCounty?.median) + ' (median)'
          }
          onChange={(e) => {
            setHomePrice(handlePriceChange(e.target.value))
          }}
          value={homePrice}
        />
      </span>
      <span className="flex gap-2">
        <label htmlFor="propertyType">Property Type</label>
        <select
          id="propertyType"
          onChange={(e) => setPropertyType(parseInt(e.target.value))}
          value={propertyType}
        >
          <option value="1">Single Family (including w/ ADU)</option>
          <option disabled>---Multi-Family---</option>
          <option value="2">Duplex</option>
          <option value="3">Triplex</option>
          <option value="4">Fourplex</option>
        </select>
      </span>
    </div>
  )
}
