import Head from 'next/head'
import { useState, useEffect, use } from 'react'
import { states, rates_by_county } from '@/lib/data'
import { County, CustomProps } from '@/lib/types'
import { getCleanNumber, handlePriceChange } from '@/lib/helpers'
import { LoanInfoCard } from '@/components/LoanInfoCard'
import { PropertyInfoCard } from '@/components/PropertyInfoCard'
import { MonthlyCostsBreakdown } from '@/components/MonthlyCostsCard'

const defaultCustomProps = {
  customHomeOwnersInsurance: false,
  customMortgageInsurance: false,
  customPropertyTax: false,
}

export default function Home() {
  const [primaryInterestRate, setPrimaryInterestRate] = useState<
    number | undefined
  >(7.0)
  const [FHAInterestRate, setFHAInterestRate] = useState<number | undefined>(
    6.8,
  )
  const [piggybackInterestRate, setPiggybackInterestRate] = useState<
    number | undefined
  >(7.6)
  const [loanType, setLoanType] = useState<string>('conventional')
  const [piggyBackLoanAmount, setPiggyBackLoanAmount] = useState<string>('')
  const [counties, setCounties] = useState<County[] | undefined>()
  const [selectedState, setSelectedState] = useState<string | undefined>('OR')
  const [selectedCounty, setSelectedCounty] = useState<County | undefined>()
  const [homePrice, setHomePrice] = useState<string>('1,000,000')
  const [propertyType, setPropertyType] = useState<number>(1)
  const [conventionalLoanLimit, setConventionalLoanLimit] = useState<number>(0)
  const [FHALoanLimit, setFHALoanLimit] = useState<number>(0)
  const [downPayment, setDownPayment] = useState<string>('')
  const [HOADues, setHOADues] = useState<string>('0')
  const [propertyTax, setPropertyTax] = useState<string>('')
  const [primaryLoanAmount, setPrimaryLoanAmount] = useState<string>('')
  const [FHALoanAmount, setFHALoanAmount] = useState<string>('')
  const [mortgageInsurance, setMortgageInsurance] = useState<string>('')
  const [homeOwnersInsurance, setHomeOwnersInsurance] = useState<string>('')
  const [customProps, setCustomProps] = useState<CustomProps>({
    customHomeOwnersInsurance: false,
    customMortgageInsurance: false,
    customPropertyTax: false,
  })

  useEffect(() => {
    setSelectedCounty({
      id: 'OR-017',
      state_abr: 'OR',
      state: ' OREGON ',
      county_code: 17,
      county: 'DESCHUTES COUNTY',
      median: 600000,
      gse_1: 726200,
      gse_2: 929850,
      gse_3: 1123900,
      gse_4: 1396800,
      limit_type: ' H ',
      fha_1: 690000,
      fha_2: 883300,
      fha_3: 1067750,
      fha_4: 1326950,
    })
  }, [])

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

  useEffect(() => {
    setHomeOwnersInsurance(((0.01 * getCleanNumber(homePrice)) / 12).toFixed())
    setPropertyTax(((0.011 * getCleanNumber(homePrice)) / 12).toFixed())
    setMortgageInsurance(((0.01 * getCleanNumber(homePrice)) / 12).toFixed())
  }, [homePrice, loanType])

  const getTotalHomeEquity = () => {
    return (
      (getCleanNumber(downPayment) + getCleanNumber(piggyBackLoanAmount)) /
      getCleanNumber(homePrice)
    )
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
      <main className="h-screen w-screen ">
        <div className="h-full w-full overflow-y-scroll bg-blue-500 p-4">
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
              setCustomProps={setCustomProps}
              defaultCustomProps={defaultCustomProps}
            />

            {homePrice && (
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
                getTotalHomeEquity={getTotalHomeEquity}
              />
            )}

            {primaryLoanAmount && (
              <MonthlyCostsBreakdown
                primaryLoanAmount={primaryLoanAmount}
                primaryInterestRate={primaryInterestRate}
                piggybackInterestRate={piggybackInterestRate}
                piggyBackLoanAmount={piggyBackLoanAmount}
                FHAInterestRate={FHAInterestRate}
                loanType={loanType}
                HOADues={HOADues}
                setHOADues={setHOADues}
                propertyTax={propertyTax}
                setPropertyTax={setPropertyTax}
                getTotalHomeEquity={getTotalHomeEquity}
                mortgageInsurance={mortgageInsurance}
                setMortgageInsurance={setMortgageInsurance}
                homeOwnersInsurance={homeOwnersInsurance}
                setHomeOwnersInsurance={setHomeOwnersInsurance}
                customProps={customProps}
                setCustomProps={setCustomProps}
                homePrice={homePrice}
                defaultCustomProps={defaultCustomProps}
              />
            )}

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
