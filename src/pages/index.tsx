import Head from 'next/head'
import { useState, useEffect } from 'react'
import { states, rates_by_county } from '@/lib/data'
import { County, State } from '@/lib/types'
import { parsePrice } from '@/lib/helpers'

export default function Home() {
  const [primaryInterestRate, setPrimaryInterestRate] = useState<number>(7.547)
  const [FHAInterestRate, setFHAInterestRate] = useState<number>(7.45)
  const [piggybackInterestRate, setPiggybackInterestRate] =
    useState<number>(9.1)
  const [loanType, setLoanType] = useState<string>('conventional')
  const [mortgageInsurance, setMortgageInsurance] = useState<boolean>(true)
  const [counties, setCounties] = useState<County[] | undefined>(undefined)
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined,
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

  const handlePriceChange = (value: string) => {
    let newValue = value.replace(/,/g, '')
    let parsedValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parsedValue
  }

  const getCleanNumber = (price: string) => {
    return Number(price.replace(/,/g, ''))
  }

  const downPaymentTooLow = () => {
    const cleanDownPayment = getCleanNumber(downPayment)
    const cleanHomePrice = getCleanNumber(homePrice)
    if (loanType === 'conventional') {
      return cleanDownPayment / cleanHomePrice < 0.03
    }
    if (loanType === 'fha') {
      return cleanDownPayment / cleanHomePrice < 0.035
    }
  }

  const salesPriceNotMet = () => {
    const cleanDownPayment = getCleanNumber(downPayment)
    const cleanHomePrice = getCleanNumber(homePrice)
    const cleanPrimaryLoanAmount = getCleanNumber(primaryLoanAmount)
    const cleanFHALoanAmount = getCleanNumber(FHALoanAmount)
    if (loanType === 'conventional') {
      return cleanDownPayment + cleanPrimaryLoanAmount !== cleanHomePrice
    }
    if (loanType === 'fha') {
      return cleanDownPayment + cleanFHALoanAmount !== cleanHomePrice
    }
  }

  const resetLoanVars = () => {
    setPrimaryLoanAmount('')
    setFHALoanAmount('0')
    setDownPayment('')
    setPrimaryInterestRate(7.547)
    setLoanType('conventional')
    setConventionalLoanLimit(undefined)
  }

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
            <div className="flex flex-col gap-2">
              <span className="flex gap-2">
                <p className="text-2xl font-bold">Loan Info</p>
                <button
                  className="border-2 px-2 w-fit h-fit mt-1"
                  onClick={() => {
                    resetLoanVars()
                  }}
                >
                  Reset
                </button>
              </span>
              <span className="flex gap-2">
                <label htmlFor="loanType">Loan Type</label>
                <select
                  onChange={(e) => setLoanType(e.target.value)}
                  id="loanType"
                  value={loanType}
                >
                  <option value="conventional">Conventional 30-Year</option>
                  <option value="fha">FHA</option>
                  <option value="piggyback">Piggyback</option>
                  <option value="jumbo">Jumbo</option>
                </select>
              </span>
              {['conventional', 'piggyback'].includes(loanType) && (
                <>
                  {conventionalLoanLimit && (
                    <span className="flex gap-2">
                      <label htmlFor="conventionalLoanLimit">
                        Conventional Loan Limit
                      </label>
                      $
                      <input
                        id="conventionalLoanLimit"
                        value={parsePrice(conventionalLoanLimit)}
                        disabled
                      />
                    </span>
                  )}
                  <span className="flex gap-2">
                    <label htmlFor="primaryLoanAmount">
                      Primary Loan Amount
                    </label>
                    $
                    <input
                      id="primaryLoanAmount"
                      value={primaryLoanAmount}
                      onChange={(e) => {
                        setPrimaryLoanAmount(handlePriceChange(e.target.value))
                      }}
                    />
                  </span>
                  <span className="flex gap-2">
                    <label htmlFor="primaryInterestRate">
                      Primary Interest Rate
                    </label>
                    <input
                      id="primaryInterestRate"
                      value={primaryInterestRate}
                      onChange={(e) =>
                        setPrimaryInterestRate(Number(e.target.value))
                      }
                    />
                    %
                  </span>
                </>
              )}
              {loanType === 'fha' && (
                <>
                  <span className="flex gap-2">
                    <label>FHA Interest Rate</label>
                    <input
                      value={FHAInterestRate}
                      onChange={(e) =>
                        setFHAInterestRate(Number(e.target.value))
                      }
                    />
                    %
                  </span>
                  <span className="flex gap-2">
                    <label>FHA Loan Limit</label>
                    <input
                      value={FHALoanLimit && parsePrice(FHALoanLimit)}
                      disabled
                    />
                  </span>
                </>
              )}
              {loanType === 'piggyback' && (
                <span className="flex gap-2">
                  <label>Piggyback Interest Rate</label>
                  <input
                    placeholder={piggybackInterestRate.toString()}
                    onChange={(e) =>
                      setPiggybackInterestRate(Number(e.target.value))
                    }
                  />
                  %
                </span>
              )}
              <span className="flex gap-2">
                <label htmlFor="downPayment">Down Payment</label>
                $
                <input
                  id="downPayment"
                  onChange={(e) =>
                    setDownPayment(handlePriceChange(e.target.value))
                  }
                  value={downPayment}
                />
                {homePrice && primaryLoanAmount && (
                  <button
                    className="border-2 px-2"
                    onClick={() => {
                      const cleanHomePrice = getCleanNumber(homePrice)
                      const cleanLoanValue = getCleanNumber(primaryLoanAmount)
                      const optimizedDP = cleanHomePrice - cleanLoanValue
                      setDownPayment(handlePriceChange(optimizedDP.toString()))
                    }}
                  >
                    Calculate
                  </button>
                )}
                {homePrice && downPayment && (
                  <p>
                    {(
                      (getCleanNumber(downPayment) /
                        getCleanNumber(homePrice)) *
                      100
                    ).toFixed(2)}
                    % of Home Price
                  </p>
                )}
              </span>
              <div className="flex flex-col">
                {(!downPayment || downPaymentTooLow()) && (
                  <p>
                    * Minimum Down Payment is $
                    {loanType === 'fha'
                      ? '3.5%'
                      : loanType === 'conventional' || loanType === 'jumbo'
                      ? '3%'
                      : '10%'}
                  </p>
                )}
                {salesPriceNotMet() && (
                  <p>* Loan Amount + Down Payment ≠ Home Price</p>
                )}
              </div>
              {/* <hr className="w-1/2" /> */}
              {/* <p> Primary Loan Amount + Down Payment = Home Price</p>
              {primaryLoanAmount} + {downPayment} = {homePrice} */}
            </div>

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
