import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [primaryInterestRate, setPrimaryInterestRate] = useState<number>(7.547)
  const [FHAInterestRate, setFHAInterestRate] = useState<number>(7.0)
  const [piggybackInterestRate, setPiggybackInterestRate] =
    useState<number>(9.1)
  const [loanType, setLoanType] = useState<string>('conventional')
  const [mortgageInsurance, setMortgageInsurance] = useState<boolean>(true)
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
          <div className="flex flex-wrap w-full justify-around mt-4 gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold">Loan Info</p>
              <span className="flex gap-2">
                <label htmlFor="loanType">Loan Type</label>
                <select
                  onChange={(e) => setLoanType(e.target.value)}
                  id="loanType"
                >
                  <option value="conventional" selected>
                    Conventional 30-Year
                  </option>
                  <option value="fha">FHA</option>
                  <option value="piggyback">Piggyback</option>
                </select>
              </span>
              {['conventional', 'piggyback'].includes(loanType) && (
                <>
                  <span className="flex gap-2">
                    <label>Primary Interest Rate</label>
                    <input
                      type="number"
                      placeholder={primaryInterestRate.toString()}
                      onChange={(e) =>
                        setPrimaryInterestRate(Number(e.target.value))
                      }
                    />
                    %
                  </span>
                  <span className="flex gap-2">
                    <label>Conventional Loan Limit</label>
                    <input type="number" />%
                  </span>
                </>
              )}
              {loanType === 'fha' && (
                <>
                  <span className="flex gap-2">
                    <label>FHA Interest Rate</label>
                    <input
                      type="number"
                      placeholder={FHAInterestRate.toString()}
                      onChange={(e) =>
                        setFHAInterestRate(Number(e.target.value))
                      }
                    />
                    %
                  </span>
                  <span className="flex gap-2">
                    <label>FHA Loan Limit</label>
                    <input type="number" />%
                  </span>
                </>
              )}
              {loanType === 'piggyback' && (
                <span className="flex gap-2">
                  <label>Piggyback Interest Rate</label>
                  <input
                    type="number"
                    placeholder={piggybackInterestRate.toString()}
                    onChange={(e) =>
                      setPiggybackInterestRate(Number(e.target.value))
                    }
                  />
                  %
                </span>
              )}

              <span className="flex gap-2">
                <label>Mortgage Insurance</label>
                <input
                  type="checkbox"
                  checked={mortgageInsurance}
                  onChange={(e) => setMortgageInsurance(e.target.checked)}
                />
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold">Property Info</p>
              <span className="flex gap-2">
                <label>Offer Price</label>
                <input type="number" />
              </span>
              <span className="flex gap-2">
                <label>Down Payment</label>
                <input type="number" />
              </span>
              <span className="flex gap-2">
                <label>Property Taxes (Annual)</label>
                <input type="number" />
              </span>
              <span className="flex gap-2">
                <label>Property Type</label>
                <input type="number" />
              </span>
              <span className="flex gap-2">
                <label>Number of Units</label>
                <input type="number" />
              </span>
              <span className="flex gap-2">
                <label>HOA Dues (Monthly)</label>
                <input type="number" />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold">Income Info</p>
              <span className="flex gap-2">
                <label>Rental Income (Monthly)</label>
                <input type="number" />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold">Closing Costs</p>
              <span className="flex gap-2">
                <label>Appraisal</label>
                <input type="number" />
              </span>
              <span className="flex gap-2">
                <label>Inspection</label>
                <input type="number" />
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
