import { County, State } from '@/lib/types'
import { parsePrice, handlePriceChange, getCleanNumber } from '@/lib/helpers'

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
}: PropertyInfoCardProps) => {
  const resetPropertyVars = () => {
    setSelectedState('initial')
    setSelectedCounty(undefined)
    setHomePrice('')
    setPropertyType(1)
  
  }

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <span className="flex gap-2">
        <p className="text-2xl font-bold">Property Info</p>
        <button
          className="border-2 px-2 w-fit h-fit mt-1"
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
          <label htmlFor="state">County/Region</label>
          <select
            id="state"
            className=""
            onChange={(e) => {
              const selectedCounty = counties?.find(
                (county) => county.id === e.target.value,
              )
              setSelectedCounty(selectedCounty)
            }}
            defaultValue="initial"
          >
            <option disabled value="initial">
              Select Region
            </option>
            {counties?.map((county) => (
              <option key={county.id} value={county.id}>
                {county.county}
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
          <option value="1">Single Family</option>
          <option disabled>---Multi-Family---</option>
          <option value="2">Duplex</option>
          <option value="3">Triplex</option>
          <option value="4">Fourplex</option>
        </select>
      </span>
    </div>
  )
}
