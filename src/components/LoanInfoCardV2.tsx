import { useState, useRef } from 'react'
import { BiSliderAlt } from 'react-icons/bi'
import { LoanMaximums, OptimizedLoans } from '@/lib/types'

interface LoanInfoCardProps {
  downPayment: number
  optimizedLoans: OptimizedLoans | undefined
  setDownPayment: (downPayment: number) => void
  loanMaximums: LoanMaximums | undefined
}

export const LoanInfoCard = ({
  downPayment,
  optimizedLoans,
  setDownPayment,
  loanMaximums,
}: LoanInfoCardProps) => {
  const [loanSettingsExpanded, setLoanSettingsExpanded] =
    useState<boolean>(false)

  const downPaymentInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">Loan Options</h1>
      <span className="flex w-[40%] flex-col">
        <label htmlFor="down-payment">Down Payment</label>
        <input
          id="down-payment"
          type="number"
          className="rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          ref={downPaymentInputRef}
          value={downPayment || ''}
          onChange={(e) => {
            setDownPayment(Number(e.target.value))
          }}
          placeholder="Defaults To Minimums"
        />
      </span>
      <span className="flex w-full items-center justify-center">
        <hr className="my-2 flex w-full border-slate-900" />
      </span>
      <div className="flex flex-col gap-2">
        <span className="flex flex-wrap gap-4">
          <span className="flex w-fit flex-col">
            <h2 className="font-bold">Conventional Mortgage</h2>
            <p>Loan Maximum: ${optimizedLoans?.conventional?.loanLimit}</p>
            <p>
              Loan Amount: ${optimizedLoans?.conventional?.primaryLoanAmount}
            </p>
            <p>Down Payment: ${optimizedLoans?.conventional?.downPayment}</p>
            <p>Equity: {optimizedLoans?.conventional?.equity}%</p>
          </span>

          <span className="flex w-fit flex-col">
            <h2 className="font-bold">FHA Mortgage</h2>
            <p>Loan Maximum: ${loanMaximums?.fha_max}</p>
            <p>Loan Amount: ${optimizedLoans?.fha?.primaryLoanAmount}</p>
            <p>Down Payment: ${optimizedLoans?.fha?.downPayment}</p>
            <p>Equity: {optimizedLoans?.fha?.equity}%</p>
          </span>

          <span className="flex w-fit flex-col">
            <h2 className="font-bold">Piggy Back Mortgage</h2>
            <p>Primary Loan Maximum: ${loanMaximums?.conventional_max}</p>
            <p>
              Primary Loan Amount: $
              {optimizedLoans?.piggy_back?.primaryLoanAmount}
            </p>
            <p>
              Secondary Loan Amount: $
              {optimizedLoans?.piggy_back?.secondaryLoanAmount}
            </p>

            <p>Down Payment: ${optimizedLoans?.piggy_back?.downPayment}</p>
            <p>Equity: {optimizedLoans?.piggy_back?.equity}%</p>
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
