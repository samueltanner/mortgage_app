import Head from 'next/head'
import { useState, useEffect } from 'react'
import { states, rates_by_county } from '@/lib/data'
import { County, State } from '@/lib/types'
import { parsePrice, getCleanNumber, handlePriceChange } from '@/lib/helpers'
import { LoanInfoCard } from '@/components/LoanInfoCard'

export default function Home() {
  const [primaryInterestRate, setPrimaryInterestRate] = useState<number>(7.547)
  const [FHAInterestRate, setFHAInterestRate] = useState<number>(7.45)
  const [piggybackInterestRate, setPiggybackInterestRate] =
    useState<number>(9.1)
  const [loanType, setLoanType] = useState<string>('conventional')
  const [mortgageInsurance, setMortgageInsurance] = useState<boolean>(true)
  const [counties, setCounties] = useState<County[] | undefined>(undefined)
  const [selectedState, setSelectedState] = useState<string | undefined>(
    'initial',
  )
  const [selectedCounty, setSelectedCounty] = useState<County>()
  const [homePrice, setHomePrice] = useState<string>('')
  const [propertyType, setPropertyType] = useState<number>(1)
  const [conventionalLoanLimit, setConventionalLoanLimit] = useState<
    number | undefined
  >()
  const [FHALoanLimit, setFHALoanLimit] = useState<number | undefined>()
  const [downPayment, setDownPayment] = useState<string>('')
  const [HOADues, setHOADues] = useState<string>('')
  const [propertyTax, setPropertyTax] = useState<string>('')
  const [primaryLoanAmount, setPrimaryLoanAmount] = useState<string>('')
  const [FHALoanAmount, setFHALoanAmount] = useState<string>('')

  useEffect(() => {
    if (!selectedState) return
    const filteredCounties = rates_by_county.filter((county) => {
      return county.state_abr === selectedState
    })
    setCounties(filteredCounties)
  }, [selectedState])

  useEffect(() => {
    if (!selectedCounty) return setConventionalLoanLimit(undefined)
    if (loanType === 'conventional' && propertyType === 1)
      return setConventionalLoanLimit(selectedCounty.gse_1)

    if (loanType === 'conventional' && propertyType === 2)
      return setConventionalLoanLimit(selectedCounty.gse_2)

    if (loanType === 'conventional' && propertyType === 3)
      return setConventionalLoanLimit(selectedCounty.gse_3)

    if (loanType === 'conventional' && propertyType === 4)
      return setConventionalLoanLimit(selectedCounty.gse_4)

    if (loanType === 'fha' && propertyType === 1)
      return setFHALoanLimit(selectedCounty.fha_1)

    if (loanType === 'fha' && propertyType === 2)
      return setFHALoanLimit(selectedCounty.fha_2)

    if (loanType === 'fha' && propertyType === 3)
      return setFHALoanLimit(selectedCounty.fha_3)

    if (loanType === 'fha' && propertyType === 4)
      return setFHALoanLimit(selectedCounty.fha_4)
  }, [selectedCounty, loanType, propertyType, selectedState])

  const resetPropertyVars = () => {
    setSelectedState('initial')
    setSelectedCounty(undefined)
    setHomePrice('')
    setPropertyType(1)
    setPropertyTax('')
    setHOADues('')
  }

  return (
    <>
      <Head>
        <title>Mortgage App</title>
        <meta
          name="description"
          content="Figure out how much home you can buy"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen">
        <div className="h-full w-full bg-blue-500 p-4">
          <div className="bg-orange-500 flex justify-center p-2 -mt-4 -mx-4">
            <p className="text-3xl font-extrabold">What House Can I Afford?</p>
          </div>
          <div className="flex flex-col w-full justify-around mt-4 gap-6">
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
                    selectedCounty &&
                    parsePrice(selectedCounty?.median) + ' (median)'
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
                  defaultValue="1"
                >
                  <option value="1">Single Family</option>
                  <option disabled>---Multi-Family---</option>
                  <option value="2">Duplex</option>
                  <option value="3">Triplex</option>
                  <option value="4">Fourplex</option>
                </select>
              </span>
              <span className="flex gap-2">
                <label htmlFor="propTax">Property Taxes (Annual)</label>
                $
                <input
                  id="propTax"
                  value={propertyTax}
                  onChange={(e) => {
                    setPropertyTax(handlePriceChange(e.target.value))
                  }}
                />
                {homePrice && propertyTax && (
                  <p>
                    {(
                      (getCleanNumber(propertyTax) /
                        getCleanNumber(homePrice)) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                )}
              </span>
              <span className="flex gap-2">
                <label>HOA Dues (Monthly)</label>
                $
                <input
                  value={HOADues}
                  onChange={(e) => {
                    setHOADues(handlePriceChange(e.target.value))
                  }}
                />
              </span>
            </div>

            <LoanInfoCard
              loanType={loanType}
              conventionalLoanLimit={conventionalLoanLimit}
              FHAInterestRate={FHAInterestRate}
              setLoanType={setLoanType}
              setPrimaryLoanAmount={setPrimaryLoanAmount}
              FHALoanLimit={FHALoanLimit}
              setFHAInterestRate={setFHAInterestRate}
              setPiggybackInterestRate={setPiggybackInterestRate}
              setFHALoanAmount={setFHALoanAmount}
              setDownPayment={setDownPayment}
              setPrimaryInterestRate={setPrimaryInterestRate}
              setConventionalLoanLimit={setConventionalLoanLimit}
              piggybackInterestRate={piggybackInterestRate}
              FHALoanAmount={FHALoanAmount}
              primaryInterestRate={primaryInterestRate}
              homePrice={homePrice}
              downPayment={downPayment}
              primaryLoanAmount={primaryLoanAmount}
            />

            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold">Income Info</p>
              <span className="flex gap-2">
                <label>Household Income (Annual)</label>
                <input />
              </span>
              <span className="flex gap-2">
                <label>Rental Income (Monthly)</label>
                <input />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold">Closing Costs</p>
              <span className="flex gap-2">
                <label>Appraisal</label>
                <input />
              </span>
              <span className="flex gap-2">
                <label>Inspection</label>
                <input />
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
