import { getCleanNumber } from '@/lib/helpers'
import { useState } from 'react'

interface MonthlyCostsBreakdownProps {
  primaryLoanAmount: string
  primaryInterestRate: number | undefined
  piggybackInterestRate: number | undefined
  piggyBackLoanAmount: string
  FHAInterestRate: number | undefined
}
export const MonthlyCostsBreakdown = ({
  primaryLoanAmount,
  primaryInterestRate,
  piggybackInterestRate,
  piggyBackLoanAmount,
  FHAInterestRate,
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
    12 * 30,
    piggybackInterestRate || 0,
    interestOnly,
  )

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <span className="flex gap-2">
        <p className="text-2xl font-bold">Monthly Cost Breakdown</p>
        <button className="border-2 px-2 w-fit h-fit mt-1" onClick={() => {}}>
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
      <span className="flex gap-2">
        <label>HOA Monthly Dues</label>
        <input />
      </span>
      <span className="flex gap-2">
        <label>Mortgage Insurance</label>
        <input />
      </span>
      <span className="flex gap-2">
        <label>Home Owners Insurance</label>
        <input />
      </span>
      <span className="flex gap-2">
        <label>Property Taxes</label>
        <input />
      </span>
    </div>
  )
}
