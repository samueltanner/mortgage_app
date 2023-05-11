import { parsePrice } from '@/lib/helpers'
import { ClosingCosts } from '@/lib/types'
type ClosingCostsAndFeesProps = {
  closingCosts: ClosingCosts
  handleUpdateClosingCosts: (updates: Record<string, number>) => void
  getCashToClose: () => number
  downPayment: number | undefined
}
export const ClosingCostsAndFeesCard = ({
  closingCosts,
  handleUpdateClosingCosts,
  getCashToClose,
  downPayment,
}: ClosingCostsAndFeesProps) => {
  return (
    <div>
      <span className="flex flex-col">
        <label htmlFor="sellers-credit">Seller&apos;s Credit</label>
        <input
          id="sellers-credit"
          type="number"
          className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          value={closingCosts.sellers_credit || ''}
          onChange={(e) => {
            const updates = {
              sellers_credit: Number(e.target.value),
            }
            handleUpdateClosingCosts(updates)
          }}
        />
      </span>
      <span className="flex flex-col">
        <label htmlFor="appraisal">Appraisal</label>
        <input
          id="appraisal"
          type="number"
          className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          value={closingCosts.appraisal || ''}
          onChange={(e) =>
            handleUpdateClosingCosts({ appraisal: Number(e.target.value) })
          }
        />
      </span>
      <span className="flex flex-col">
        <label htmlFor="inspection">Inspection</label>
        <input
          id="inspection"
          type="number"
          className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          value={closingCosts.inspection || ''}
          onChange={(e) =>
            handleUpdateClosingCosts({ inspection: Number(e.target.value) })
          }
        />
      </span>
      <span className="flex flex-col">
        <label htmlFor="lending-fees">Lending Fees</label>
        <input
          id="lending-fees"
          type="number"
          className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          value={closingCosts.lending_fees || ''}
          onChange={(e) =>
            handleUpdateClosingCosts({ lending_fees: Number(e.target.value) })
          }
        />
      </span>
      <span className="flex flex-col">
        <label htmlFor="down-payment">Down Payment</label>
        <input
          id="down-payment"
          type="number"
          disabled
          className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          value={downPayment || ''}
        />
      </span>
      <hr className="my-4 border-slate-900" />
      <h1 className={` text-md font-bold`}>Cash To Close</h1>
      <p>${parsePrice(getCashToClose())}</p>
    </div>
  )
}
