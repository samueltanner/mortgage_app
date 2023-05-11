import { useState, useMemo } from 'react'
import { BiCalculator, BiReset, BiSliderAlt } from 'react-icons/bi'
import { OptimizedLoans, InterestRates } from '@/lib/types'
import { LoanDataTable } from './DataTable'
import { parsePrice } from '@/lib/helpers'
import { parse } from 'path'

interface LoanInfoCardProps {
  optimizedLoans: OptimizedLoans | undefined
  setDownPayment: (downPayment: number) => void
  interestRates: InterestRates
  selectedLoan: string | null
  setSelectedLoan: (loan: string | null) => void
}

export const LoanInfoCard = ({
  optimizedLoans,
  setDownPayment,
  interestRates,
  selectedLoan,
  setSelectedLoan,
}: LoanInfoCardProps) => {
  const [tempDownPayment, setTempDownPayment] = useState<number | undefined>()

  const handleCustomDownPayment = () => {
    if (tempDownPayment) {
      setDownPayment(tempDownPayment)
    }
  }

  const handleResetDownPayment = () => {
    setDownPayment(0)
    setTempDownPayment(undefined)
  }

  const tableData = useMemo(
    () => [
      {
        loan_type: 'conventional',
        viable: optimizedLoans?.conventional?.loanViable,
        interest_rate: `${interestRates?.conventional || 0}%`,
        down_payment: parsePrice(
          optimizedLoans?.conventional?.downPayment,
          true,
        ),
        monthly_pi: parsePrice(
          optimizedLoans?.conventional?.primaryLoanPI,
          true,
        ),
        mortgage_insurance: parsePrice(
          optimizedLoans?.conventional?.mortgageInsurance,
          true,
        ),
        loan_max: parsePrice(optimizedLoans?.conventional?.loanLimit, true),
        loan_amount: parsePrice(
          optimizedLoans?.conventional?.primaryLoanAmount,
          true,
        ),
        equity: `${optimizedLoans?.conventional?.equityPercentage || 0}%`,
        sec_monthly_pi: '-',
        sec_monthly_io: '-',
        sec_interest_rate: '-',
        sec_loan_amount: '-',
      },
      {
        loan_type: 'fha',
        viable: optimizedLoans?.fha?.loanViable,
        interest_rate: `${interestRates?.fha || 0}%`,
        down_payment: parsePrice(optimizedLoans?.fha?.downPayment, true),
        monthly_pi: parsePrice(optimizedLoans?.fha?.primaryLoanPI, true),
        mortgage_insurance: parsePrice(
          optimizedLoans?.fha?.mortgageInsurance,
          true,
        ),
        loan_max: parsePrice(optimizedLoans?.fha?.loanLimit, true),
        loan_amount: parsePrice(optimizedLoans?.fha?.primaryLoanAmount, true),
        equity: `${optimizedLoans?.fha?.equityPercentage || 0}%`,
        sec_monthly_pi: '-',
        sec_monthly_io: '-',
        sec_interest_rate: '-',
        sec_loan_amount: '-',
      },
      {
        loan_type: 'jumbo',
        viable: optimizedLoans?.jumbo?.loanViable,
        interest_rate: `${interestRates?.jumbo || 0}%`,
        down_payment: parsePrice(optimizedLoans?.jumbo?.downPayment, true),
        monthly_pi: parsePrice(optimizedLoans?.jumbo?.primaryLoanPI, true),
        mortgage_insurance: parsePrice(
          optimizedLoans?.jumbo?.mortgageInsurance,
          true,
        ),
        loan_max: parsePrice(optimizedLoans?.jumbo?.loanLimit, true),
        loan_amount: parsePrice(optimizedLoans?.jumbo?.primaryLoanAmount, true),
        equity: `${optimizedLoans?.jumbo?.equityPercentage || 0}%`,
        sec_monthly_pi: '-',
        sec_monthly_io: '-',
        sec_interest_rate: '-',
        sec_loan_amount: '-',
      },
      {
        loan_type: 'piggy_back',
        viable: optimizedLoans?.piggy_back?.loanViable,
        interest_rate: `${interestRates?.conventional || 0}%`,
        down_payment: parsePrice(optimizedLoans?.piggy_back?.downPayment, true),
        monthly_pi: parsePrice(optimizedLoans?.piggy_back?.primaryLoanPI, true),
        mortgage_insurance: parsePrice(
          optimizedLoans?.piggy_back?.mortgageInsurance,
          true,
        ),
        loan_max: parsePrice(optimizedLoans?.piggy_back?.loanLimit, true),
        loan_amount: parsePrice(
          optimizedLoans?.piggy_back?.primaryLoanAmount,
          true,
        ),
        equity: `${optimizedLoans?.piggy_back?.equityPercentage || 0}%`,
        sec_monthly_pi: parsePrice(
          optimizedLoans?.piggy_back?.secondaryLoanPI,
          true,
        ),
        sec_monthly_io: parsePrice(
          optimizedLoans?.piggy_back?.secondaryLoanIO,
          true,
        ),
        sec_interest_rate: `${interestRates?.piggy_back || 0}%`,
        sec_loan_amount: parsePrice(
          optimizedLoans?.piggy_back?.secondaryLoanAmount,
          true,
        ),
      },
    ],
    [optimizedLoans, interestRates],
  )

  const columns = useMemo(
    () => [
      { Header: 'Loan Type', accessor: 'loan_type' },
      // { Header: '', accessor: 'viable' },
      { Header: 'Interest Rate', accessor: 'interest_rate' },
      { Header: 'Down Payment', accessor: 'down_payment' },
      { Header: 'Monthly PI', accessor: 'monthly_pi' },
      { Header: 'Mortgage Insurance', accessor: 'mortgage_insurance' },
      { Header: 'Loan Max', accessor: 'loan_max' },
      { Header: 'Loan Amount', accessor: 'loan_amount' },
      { Header: 'Equity', accessor: 'equity' },
      { Header: 'Secondary Monthly PI', accessor: 'sec_monthly_pi' },
      { Header: 'Secondary Monthly IO', accessor: 'sec_monthly_io' },
      { Header: 'Secondary Interest Rate', accessor: 'sec_interest_rate' },
      { Header: 'Secondary Loan Amount', accessor: 'sec_loan_amount' },
    ],
    [],
  )

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">Loan Options</h1>
      <span className="flex flex-nowrap items-end gap-4">
        <span className="flex w-[40%] flex-col">
          <label htmlFor="down-payment">Down Payment</label>
          <input
            id="down-payment"
            type="number"
            className="rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={tempDownPayment || ''}
            onChange={(e) => {
              setTempDownPayment(Number(e.target.value))
            }}
            placeholder="Defaults To Minimums"
          />
        </span>
        <button
          className="flex h-10 w-10 flex-none items-center justify-center rounded-md border-2 border-teal-400 bg-teal-400 duration-300 ease-in-out hover:bg-teal-200 "
          onClick={() => {
            handleCustomDownPayment()
          }}
        >
          <BiCalculator className="h-6 w-6" />
        </button>
        <button
          className="flex h-10 w-10 flex-none items-center justify-center rounded-md border-2 border-teal-400 bg-teal-400 duration-300 ease-in-out hover:bg-teal-200 "
          onClick={() => {
            handleResetDownPayment()
          }}
        >
          <BiReset className="h-6 w-6" />
        </button>
      </span>

      <span className="flex w-full items-center justify-center">
        <hr className="my-2 flex w-full border-slate-900" />
      </span>
      <div className="flex flex-col gap-2">
        <div className="overflow-x-scroll">
          <LoanDataTable
            data={tableData}
            columns={columns}
            setSelectedLoan={setSelectedLoan}
            selectedLoan={selectedLoan}
          />
        </div>
        {/* <span className="flex flex-wrap gap-4">
          <span
            className={`${
              optimizedLoans?.conventional.loanViable
                ? 'text-black'
                : 'text-gray-300'
            } flex w-fit cursor-pointer flex-col`}
            onClick={() => {
              optimizedLoans?.conventional.loanViable &&
                setSelectedLoan('conventional')
            }}
          >
            <h2
              className={`font-bold ${
                selectedLoan === 'conventional' && 'text-teal-500 underline'
              }`}
            >
              Conventional Mortgage
            </h2>
            <p>Interest Rate: {interestRates?.conventional}%</p>
            <p>Down Payment: ${optimizedLoans?.conventional?.downPayment}</p>
            <p>Monthly P&I: ${optimizedLoans?.conventional?.primaryLoanPI}</p>
            <p>
              Mortgage Insurance: $
              {optimizedLoans?.conventional?.mortgageInsurance}
            </p>
            <p>Loan Maximum: ${optimizedLoans?.conventional?.loanLimit}</p>
            <p>
              Loan Amount: ${optimizedLoans?.conventional?.primaryLoanAmount}
            </p>
            <p>Equity: {optimizedLoans?.conventional?.equityPercentage}%</p>
          </span>

          <span
            className={`${
              optimizedLoans?.fha.loanViable ? 'text-black' : 'text-gray-300'
            } flex w-fit cursor-pointer flex-col`}
            onClick={() => {
              optimizedLoans?.fha.loanViable && setSelectedLoan('fha')
            }}
          >
            <h2
              className={`font-bold ${
                selectedLoan === 'fha' && 'text-teal-500 underline'
              }`}
            >
              FHA Mortgage
            </h2>
            <p>Interest Rate: {interestRates?.fha}%</p>
            <p>Down Payment: ${optimizedLoans?.fha?.downPayment}</p>
            <p>Monthly P&I: ${optimizedLoans?.fha?.primaryLoanPI}</p>
            <p>Mortgage Insurance: ${optimizedLoans?.fha?.mortgageInsurance}</p>
            <p>Loan Maximum: ${optimizedLoans?.fha?.loanLimit}</p>
            <p>Loan Amount: ${optimizedLoans?.fha?.primaryLoanAmount}</p>
            <p>Equity: {optimizedLoans?.fha?.equityPercentage}%</p>
          </span>

          <span
            className={`${
              optimizedLoans?.piggy_back.loanViable
                ? 'text-black'
                : 'text-gray-300'
            } flex w-fit cursor-pointer flex-col`}
            onClick={() => {
              optimizedLoans?.piggy_back.loanViable &&
                setSelectedLoan('piggy_back')
            }}
          >
            <h2
              className={`font-bold ${
                selectedLoan === 'piggy_back' && 'text-teal-500 underline'
              }`}
            >
              Piggy Back Mortgage
            </h2>
            <p>Interest Rate: {interestRates?.conventional}%</p>
            <p>Down Payment: ${optimizedLoans?.piggy_back?.downPayment}</p>
            <p>
              Monthly P&I (Primary Loan): $
              {optimizedLoans?.piggy_back?.primaryLoanPI}
            </p>
            <p>
              Monthly P&I (Secondary Loan): $
              {optimizedLoans?.piggy_back?.secondaryLoanPI}
            </p>
            <p>
              Monthly Interest Only (Secondary Loan): $
              {optimizedLoans?.piggy_back?.secondaryLoanIO}
            </p>
            <p>
              Mortgage Insurance: $
              {optimizedLoans?.piggy_back?.mortgageInsurance}
            </p>
            <p>Secondary Interest Rate: {interestRates?.piggy_back}%</p>
            <p>
              Primary Loan Maximum: ${optimizedLoans?.piggy_back?.loanLimit}
            </p>
            <p>
              Primary Loan Amount: $
              {optimizedLoans?.piggy_back?.primaryLoanAmount}
            </p>
            <p>
              Secondary Loan Amount: $
              {optimizedLoans?.piggy_back?.secondaryLoanAmount}
            </p>

            <p>Equity: {optimizedLoans?.piggy_back?.equityPercentage}%</p>
          </span>

          <span
            className={`${
              optimizedLoans?.jumbo.loanViable ? 'text-black' : 'text-gray-300'
            } flex w-fit cursor-pointer flex-col`}
            onClick={() => {
              optimizedLoans?.jumbo.loanViable && setSelectedLoan('jumbo')
            }}
          >
            <h2
              className={`font-bold ${
                selectedLoan === 'jumbo' && 'text-teal-500 underline'
              }`}
            >
              Jumbo Mortgage
            </h2>
            <p>Interest Rate: {interestRates?.jumbo}%</p>
            <p>Down Payment: ${optimizedLoans?.jumbo?.downPayment}</p>
            <p>Monthly P&I: ${optimizedLoans?.jumbo?.primaryLoanPI}</p>
            <p>
              Mortgage Insurance: ${optimizedLoans?.jumbo?.mortgageInsurance}
            </p>
            <p>
              Primary Loan Amount: ${optimizedLoans?.jumbo?.primaryLoanAmount}
            </p>
            <p>Equity: {optimizedLoans?.jumbo?.equityPercentage}%</p>
          </span>
        </span> */}
      </div>
    </div>
  )
}
