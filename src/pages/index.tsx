import Head from 'next/head'
import { useState, useEffect } from 'react'
import { states, rates_by_county } from '@/lib/data'
import { County, State } from '@/lib/types'
import { parsePrice, getCleanNumber, handlePriceChange } from '@/lib/helpers'
import { LoanInfoCard } from '@/components/LoanInfoCard'
import { PropertyInfoCard } from '@/components/PropertyInfoCard'
import { MonthlyCostsBreakdown } from '@/components/MonthlyCostsCard'

export default function Home() {
  const [primaryInterestRate, setPrimaryInterestRate] = useState<
    number | undefined
  >(7.547)
  const [FHAInterestRate, setFHAInterestRate] = useState<number | undefined>(
    7.45,
  )
  const [piggybackInterestRate, setPiggybackInterestRate] = useState<
    number | undefined
  >(9.1)
  const [loanType, setLoanType] = useState<string>('conventional')
  const [piggyBackLoanAmount, setPiggyBackLoanAmount] = useState<string>('')
  const [counties, setCounties] = useState<County[] | undefined>(undefined)
  const [selectedState, setSelectedState] = useState<string | undefined>(
    'initial',
  )
  const [selectedCounty, setSelectedCounty] = useState<County>()
  const [homePrice, setHomePrice] = useState<string>('')
  const [propertyType, setPropertyType] = useState<number>(1)
  const [conventionalLoanLimit, setConventionalLoanLimit] = useState<number>(0)
  const [FHALoanLimit, setFHALoanLimit] = useState<number>(0)
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
    if (!selectedCounty)
      return setConventionalLoanLimit(Number.POSITIVE_INFINITY)

    if (
      (loanType === 'conventional' ||
        loanType === 'piggyback' ||
        loanType === 'jumbo') &&
      propertyType === 1
    )
      return setConventionalLoanLimit(selectedCounty.gse_1)

    if (
      (loanType === 'conventional' ||
        loanType === 'piggyback' ||
        loanType === 'jumbo') &&
      propertyType === 2
    )
      return setConventionalLoanLimit(selectedCounty.gse_2)

    if (
      (loanType === 'conventional' ||
        loanType === 'piggyback' ||
        loanType === 'jumbo') &&
      propertyType === 3
    )
      return setConventionalLoanLimit(selectedCounty.gse_3)

    if (
      (loanType === 'conventional' ||
        loanType === 'piggyback' ||
        loanType === 'jumbo') &&
      propertyType === 4
    )
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
            <PropertyInfoCard
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              states={states}
              counties={counties}
              selectedCounty={selectedCounty}
              setSelectedCounty={setSelectedCounty}
              homePrice={homePrice}
              setHomePrice={setHomePrice}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
            />

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
              propertyType={propertyType}
              piggyBackLoanAmount={piggyBackLoanAmount}
              setPiggyBackLoanAmount={setPiggyBackLoanAmount}
            />

            <MonthlyCostsBreakdown
              primaryLoanAmount={primaryLoanAmount}
              primaryInterestRate={primaryInterestRate}
              piggybackInterestRate={piggybackInterestRate}
              piggyBackLoanAmount={piggyBackLoanAmount}
              FHAInterestRate={FHAInterestRate}
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
          </div>
        </div>
      </main>
    </>
  )
}
