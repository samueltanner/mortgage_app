import { useState, useRef, useEffect } from 'react'
import { BiCalculator, BiReset, BiSliderAlt } from 'react-icons/bi'
import { LoanMaximums, OptimizedLoans } from '@/lib/types'
import { getOptimizedLoan } from '@/lib/optimizeLoanHelper'

interface LoanInfoCardProps {
  downPayment: number | undefined
  optimizedLoans: OptimizedLoans | undefined
  setDownPayment: (downPayment: number) => void
  loanMaximums: LoanMaximums | undefined
}

interface LoanOptionsObj {
  conventional: boolean
  fha: boolean
  piggy_back: boolean
  jumbo: boolean
}

export const LoanInfoCard = ({
  downPayment,
  optimizedLoans,
  setDownPayment,
  loanMaximums,
}: LoanInfoCardProps) => {
  const [tempDownPayment, setTempDownPayment] = useState<number | undefined>()
  const [viableLoanOptions, setViableLoanOptions] = useState<LoanOptionsObj>({
    conventional: true,
    fha: true,
    piggy_back: true,
    jumbo: true,
  })

  const handleCustomDownPayment = () => {
    setDownPayment(tempDownPayment || 0)
    const viableLoanOptions = getViableLoanOptionsByDownPayment(
      tempDownPayment || 0,
    )
    setViableLoanOptions(viableLoanOptions)
  }

  const handleResetDownPayment = () => {
    setDownPayment(0)
    setTempDownPayment(undefined)
    const viableLoanOptions = getViableLoanOptionsByDownPayment(0)
    setViableLoanOptions(viableLoanOptions)
  }

  const getViableLoanOptionsByDownPayment = (downPayment: number) => {
    if (!downPayment || !optimizedLoans)
      return {
        conventional: true,
        fha: true,
        piggy_back: true,
        jumbo: true,
      }
    downPayment >= optimizedLoans?.conventional?.downPayment
      ? (viableLoanOptions.conventional = true)
      : (viableLoanOptions.conventional = false)

    downPayment >= optimizedLoans?.fha?.downPayment
      ? (viableLoanOptions.fha = true)
      : (viableLoanOptions.fha = false)

    downPayment >= optimizedLoans?.piggy_back?.downPayment
      ? (viableLoanOptions.piggy_back = true)
      : (viableLoanOptions.piggy_back = false)

    downPayment >= optimizedLoans?.jumbo?.downPayment
      ? (viableLoanOptions.jumbo = true)
      : (viableLoanOptions.jumbo = false)

    return viableLoanOptions
  }

  useEffect(() => {
    if (!downPayment) return
  }, [downPayment])

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          console.log(downPayment, optimizedLoans)
        }}
      >
        test
      </button>
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
              viableLoanOptions.conventional ? 'text-black' : 'text-gray-300'
            } flex w-fit flex-col`}
          >
            <h2 className="font-bold">Conventional Mortgage</h2>
            <p>Loan Maximum: ${optimizedLoans?.conventional?.loanLimit}</p>
            <p>
              Loan Amount: ${optimizedLoans?.conventional?.primaryLoanAmount}
            </p>
            <p>Down Payment: ${optimizedLoans?.conventional?.downPayment}</p>
            <p>Equity: {optimizedLoans?.conventional?.equity}%</p>
          </span>

          <span
            className={`${
              viableLoanOptions.fha ? 'text-black' : 'text-gray-300'
            } flex w-fit flex-col`}
          >
            <h2 className="font-bold">FHA Mortgage</h2>
            <p>Loan Maximum: ${optimizedLoans?.fha?.loanLimit}</p>
            <p>Loan Amount: ${optimizedLoans?.fha?.primaryLoanAmount}</p>
            <p>Down Payment: ${optimizedLoans?.fha?.downPayment}</p>
            <p>Equity: {optimizedLoans?.fha?.equity}%</p>
          </span>

          <span
            className={`${
              viableLoanOptions.piggy_back ? 'text-black' : 'text-gray-300'
            } flex w-fit flex-col`}
          >
            <h2 className="font-bold">Piggy Back Mortgage</h2>
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

            <p>Down Payment: ${optimizedLoans?.piggy_back?.downPayment}</p>
            <p>Equity: {optimizedLoans?.piggy_back?.equity}%</p>
          </span>

          <span
            className={`${
              viableLoanOptions.jumbo ? 'text-black' : 'text-gray-300'
            } flex w-fit flex-col`}
          >
            <h2 className="font-bold">Jumbo Mortgage</h2>
            <p>
              Primary Loan Amount: ${optimizedLoans?.jumbo?.primaryLoanAmount}
            </p>
            <p>Down Payment: ${optimizedLoans?.jumbo?.downPayment}</p>
            <p>Equity: {optimizedLoans?.jumbo?.equity}%</p>
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
