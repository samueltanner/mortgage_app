import { useState, useRef, useEffect } from 'react'
import { BiCalculator, BiReset, BiSliderAlt } from 'react-icons/bi'
import { OptimizedLoans, InterestRates } from '@/lib/types'

interface LoanInfoCardProps {
  optimizedLoans: OptimizedLoans | undefined
  setDownPayment: (downPayment: number) => void
  interestRates: InterestRates
}

export const LoanInfoCard = ({
  optimizedLoans,
  setDownPayment,
  interestRates,
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
        <span className="flex flex-wrap gap-4">
          <span
            className={`${
              optimizedLoans?.conventional.loanViable
                ? 'text-black'
                : 'text-gray-300'
            } flex w-fit flex-col`}
          >
            <h2 className="font-bold">Conventional Mortgage</h2>
            <p>Interest Rate: {interestRates?.conventional}%</p>
            <p>Down Payment: ${optimizedLoans?.conventional?.downPayment}</p>
            <p>Monthly P&I: ${optimizedLoans?.conventional?.primaryLoanPI}</p>
            <p>Loan Maximum: ${optimizedLoans?.conventional?.loanLimit}</p>
            <p>
              Loan Amount: ${optimizedLoans?.conventional?.primaryLoanAmount}
            </p>
            <p>Equity: {optimizedLoans?.conventional?.equityPercentage}%</p>
          </span>

          <span
            className={`${
              optimizedLoans?.fha.loanViable ? 'text-black' : 'text-gray-300'
            } flex w-fit flex-col`}
          >
            <h2 className="font-bold">FHA Mortgage</h2>
            <p>Interest Rate: {interestRates?.fha}%</p>
            <p>Down Payment: ${optimizedLoans?.fha?.downPayment}</p>
            <p>Monthly P&I: ${optimizedLoans?.fha?.primaryLoanPI}</p>
            <p>Loan Maximum: ${optimizedLoans?.fha?.loanLimit}</p>
            <p>Loan Amount: ${optimizedLoans?.fha?.primaryLoanAmount}</p>
            <p>Equity: {optimizedLoans?.fha?.equityPercentage}%</p>
          </span>

          <span
            className={`${
              optimizedLoans?.piggy_back.loanViable
                ? 'text-black'
                : 'text-gray-300'
            } flex w-fit flex-col`}
          >
            <h2 className="font-bold">Piggy Back Mortgage</h2>
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
            } flex w-fit flex-col`}
          >
            <h2 className="font-bold">Jumbo Mortgage</h2>
            <p>Interest Rate: {interestRates?.jumbo}%</p>
            <p>Down Payment: ${optimizedLoans?.jumbo?.downPayment}</p>
            <p>
              Primary Loan Amount: ${optimizedLoans?.jumbo?.primaryLoanAmount}
            </p>
            <p>Equity: {optimizedLoans?.jumbo?.equityPercentage}%</p>
          </span>

          {/* <span className="flex w-fit flex-col">
            <h2 className="font-bold">Jumbo Mortgage</h2>
            <p>Loan Maximum: ${loanMaximums?.fha_max}</p>
            <p>Loan Amount: ${optimizedLoans?.fha?.primaryLoanAmount}</p>
            <p>Down Payment: ${optimizedLoans?.fha?.downPayment}</p>
            <p>Equity: {optimizedLoans?.fha?.equity}%</p>
          </span> */}
        </span>
      </div>
    </div>
  )
}

// {loanSettingsExpanded && (
//   <div className="flex flex-col gap-2">
//     <span className="flex flex-col">
//       <label htmlFor="down-payment">Down Payment</label>
//       <input
//         id="down-payment"
//         type="number"
//         className="rounded-md border-2 border-slate-900 bg-gray-50 px-2"
//         ref={downPaymentInputRef}
//         value={downPayment || ''}
//         onChange={(e) => {
//           setDownPayment(Number(e.target.value))
//         }}
//       />
//     </span>
//     <span className="flex gap-2">
//       <button
//         id="fha-checkbox"
//         onClick={() => {
//           setFHAEligible(!FHAEligible)
//         }}
//       >
//         <div
//           className={`relative flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 border-slate-900 bg-gray-50 px-2
//           ${
//             FHAEligible
//               ? 'border-teal-800 bg-teal-400 hover:bg-teal-200 '
//               : 'border-slate-900 bg-gray-300 hover:bg-gray-400'
//           } duration-300 ease-in-out`}
//         >
//           {FHAEligible && <BiCheck className="absolute h-5 w-5" />}
//         </div>
//       </button>
//       <label htmlFor="fha-checkbox">First-Time Home Buyer</label>
//     </span>
//     <span className="flex gap-2">
//       <button
//         id="fha-checkbox"
//         onClick={() => {
//           setPiggyBackEligible(!piggyBackEligible)
//         }}
//       >
//         <div
//           className={`relative flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 border-slate-900 bg-gray-50 px-2
//           ${
//             piggyBackEligible
//               ? 'border-teal-800 bg-teal-400 hover:bg-teal-200 '
//               : 'border-slate-900 bg-gray-300 hover:bg-gray-400'
//           } duration-300 ease-in-out`}
//         >
//           {piggyBackEligible && (
//             <BiCheck className="absolute h-5 w-5" />
//           )}
//         </div>
//       </button>
//       <label htmlFor="fha-checkbox">Show Piggy Loan Options</label>
//     </span>
//     <span className="flex gap-2">
//       <button
//         id="fha-checkbox"
//         onClick={() => {
//           setJumboEligible(!jumboEligible)
//         }}
//       >
//         <div
//           className={`relative flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 border-slate-900 bg-gray-50 px-2
//           ${
//             jumboEligible
//               ? 'border-teal-800 bg-teal-400 hover:bg-teal-200 '
//               : 'border-slate-900 bg-gray-300 hover:bg-gray-400'
//           } duration-300 ease-in-out`}
//         >
//           {jumboEligible && (
//             <BiCheck className="absolute h-5 w-5" />
//           )}
//         </div>
//       </button>
//       <label htmlFor="fha-checkbox">Show Jumbo Loan Options</label>
//     </span>
//   </div>
// )}
