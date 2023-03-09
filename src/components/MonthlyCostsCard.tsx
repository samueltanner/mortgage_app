import { getCleanNumber, handlePriceChange, parsePrice } from '@/lib/helpers'
import { useState } from 'react'
import { CustomProps } from '@/lib/types'

interface MonthlyCostsBreakdownProps {
  primaryLoanAmount: string
  primaryInterestRate: number | undefined
  piggybackInterestRate: number | undefined
  piggyBackLoanAmount: string
  FHAInterestRate: number | undefined
  loanType: string
  HOADues: string
  setHOADues: (dues: string) => void
  propertyTax: string
  setPropertyTax: (tax: string) => void
  getTotalHomeEquity: () => number
  mortgageInsurance: string
  setMortgageInsurance: (insurance: string) => void
  homeOwnersInsurance: string
  setHomeOwnersInsurance: (insurance: string) => void
  customProps: CustomProps
  setCustomProps: (props: CustomProps) => void
  homePrice: string
  defaultCustomProps: CustomProps
}
export const MonthlyCostsBreakdown = ({
  primaryLoanAmount,
  primaryInterestRate,
  piggybackInterestRate,
  piggyBackLoanAmount,
  loanType,
  HOADues,
  setHOADues,
  propertyTax,
  getTotalHomeEquity,
  mortgageInsurance,
  setMortgageInsurance,
  homeOwnersInsurance,
  setHomeOwnersInsurance,
  customProps,
  setCustomProps,
  homePrice,
  defaultCustomProps,
  setPropertyTax,
}: MonthlyCostsBreakdownProps) => {
  const [interestOnly, setInterestOnly] = useState<boolean>(false)
  const calculateLoanMonthlyCost = (
    loan: string,
    monthCount: number,
    interestRate: number,
    interestOnly: boolean = false,
  ) => {
    const principal = getCleanNumber(loan)
    const monthlyInterestRate = interestRate / 1200 // convert annual interest rate to monthly
    const numerator = monthlyInterestRate * principal
    const denominator = 1 - Math.pow(1 + monthlyInterestRate, -monthCount)
    const monthlyPayment = numerator / denominator
    const interestOnlyPayment = principal * monthlyInterestRate
    return Math.floor(interestOnly ? interestOnlyPayment : monthlyPayment)
  }

  const primaryLoanMonthlyCost = calculateLoanMonthlyCost(
    primaryLoanAmount,
    12 * 30,
    primaryInterestRate || 0,
  )

  const piggyBackMonthlyCost = calculateLoanMonthlyCost(
    piggyBackLoanAmount,
    12 * 20,
    piggybackInterestRate || 0,
    interestOnly,
  )

  const getTotalMonthlyCost = () => {
    return (
      primaryLoanMonthlyCost +
      piggyBackMonthlyCost +
      getCleanNumber(mortgageInsurance) +
      getCleanNumber(homeOwnersInsurance) +
      getCleanNumber(HOADues) +
      getCleanNumber(propertyTax)
    )
  }

  const handleCustomHomeOwnersInsurance = () => {
    const newProps = { ...customProps, customHomeOwnersInsurance: true }
    setCustomProps(newProps)
  }

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <span className="flex gap-2">
        <p className="text-2xl font-bold">Monthly Cost Breakdown</p>
        <button
          className="border-2 px-2 w-fit h-fit mt-1"
          onClick={() => {
            setCustomProps(defaultCustomProps)
            setHomeOwnersInsurance(
              ((0.01 * getCleanNumber(homePrice)) / 12).toFixed(),
            )
            setPropertyTax(((0.011 * getCleanNumber(homePrice)) / 12).toFixed())
          }}
        >
          Reset
        </button>
      </span>
      <span className="flex gap-2">
        <label>Primary Loan Monthly Cost</label>
        <input
          disabled
          value={primaryLoanMonthlyCost?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
        />
      </span>
      {loanType === 'piggyback' && (
        <span className="flex gap-2">
          <label>Piggyback Loan Monthly Cost</label>
          <input
            disabled
            value={piggyBackMonthlyCost?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })}
          />
          <input
            type="checkbox"
            id="interestOnly"
            name="interestOnly"
            value="Bike"
            onChange={(e) => {
              setInterestOnly(e.target.checked)
            }}
          />
          <label htmlFor="interestOnly">Interest Only</label>
        </span>
      )}
      <span className="flex gap-2">
        <label htmlFor="hoaDues">HOA Monthly Dues</label>
        $
        <input
          id="hoaDues"
          onChange={(e) => {
            setHOADues(handlePriceChange(e.target.value))
          }}
          value={HOADues}
        />
      </span>
      <span className="flex gap-2">
        <label htmlFor="mortgageInsurance">Mortgage Insurance</label>
        $
        <input
          id="mortgageInsurance"
          disabled={getTotalHomeEquity() >= 0.2}
          value={
            getTotalHomeEquity() >= 0.2
              ? 'N/A - Sufficient Equity'
              : mortgageInsurance
          }
          onChange={(e) => {
            setCustomProps({ ...customProps, customMortgageInsurance: true })
            setMortgageInsurance(handlePriceChange(e.target.value))
          }}
        />
        {!customProps.customMortgageInsurance ? (
          <p>* Assuming 1% of Home Value Per Year</p>
        ) : (
          <p>
            {(
              ((getCleanNumber(mortgageInsurance) * 12) /
                getCleanNumber(homePrice)) *
              100
            ).toFixed(2)}
            % of Home Price
          </p>
        )}
      </span>
      <span className="flex gap-2">
        <label htmlFor="homeOwnersInsurance">Home Owners Insurance</label>
        $
        <input
          id="homeOwnersInsurance"
          value={handlePriceChange(homeOwnersInsurance)}
          onChange={(e) => {
            setCustomProps({ ...customProps, customHomeOwnersInsurance: true })
            setHomeOwnersInsurance(handlePriceChange(e.target.value))
          }}
        />
        {!customProps.customHomeOwnersInsurance ? (
          <p>* Assuming 1% of Home Value Per Year</p>
        ) : (
          <p>
            {(
              ((getCleanNumber(homeOwnersInsurance) * 12) /
                getCleanNumber(homePrice)) *
              100
            ).toFixed(2)}
            % of Home Price
          </p>
        )}
      </span>
      <span className="flex gap-2">
        <label htmlFor="propertyTax">Property Taxes</label>
        $
        <input
          id="propertyTax"
          value={handlePriceChange(propertyTax)}
          onChange={(e) => {
            setCustomProps({ ...customProps, customPropertyTax: true })
            setPropertyTax(handlePriceChange(e.target.value))
          }}
        />
        {!customProps.customPropertyTax ? (
          <p>* Assuming 1.1% of Home Value Per Year</p>
        ) : (
          <p>
            {(
              ((getCleanNumber(propertyTax) * 12) / getCleanNumber(homePrice)) *
              100
            ).toFixed(2)}
            % of Home Price
          </p>
        )}
      </span>
      Total Monthly Cost: ${parsePrice(getTotalMonthlyCost())}
    </div>
  )
}
