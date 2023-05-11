import { parsePrice } from '@/lib/helpers'
import { ClosingCosts } from '@/lib/types'
import { DollarPercentSwitcher } from './DollarPercentSwitcher'
import { useState, useEffect } from 'react'

type ClosingCostsAndFeesProps = {
  closingCosts: ClosingCosts
  handleUpdateClosingCosts: (updates: Record<string, number>) => void
  getCashToClose: () => number
  downPayment: number | undefined
  offerPrice: number
}
export const ClosingCostsAndFeesCard = ({
  closingCosts,
  handleUpdateClosingCosts,
  getCashToClose,
  downPayment,
  offerPrice,
}: ClosingCostsAndFeesProps) => {
  const [creditInDollars, setCreditInDollars] = useState<boolean>(true)

  const getCreditValue = () => {
    const sellersCredit = closingCosts.sellers_credit || 0
    if (creditInDollars) return Math.floor(closingCosts.sellers_credit)
    const percent = sellersCredit ? (sellersCredit / offerPrice) * 100 : 0
    return parseFloat(percent.toFixed(2))
  }

  useEffect(() => {
    getCreditValue()
  }, [creditInDollars])

  return (
    <div>
      <div className="flex">
        <span>
          <label htmlFor="sellers-credit">Seller&apos;s Credit</label>
          <span className="flex w-[40%] gap-2">
            <input
              id="sellers-credit"
              type="number"
              className="rounded-md border-2 border-slate-900 bg-gray-50 px-2"
              value={getCreditValue() || ''}
              onChange={(e) => {
                const credit = Number(e.target.value) || 0
                if (creditInDollars) {
                  const updates = {
                    sellers_credit: credit,
                  }
                  handleUpdateClosingCosts(updates)
                } else {
                  const updates = {
                    sellers_credit: (credit / 100) * offerPrice,
                  }
                  handleUpdateClosingCosts(updates)
                }
              }}
            />
            <span className="flex h-full items-end">
              <DollarPercentSwitcher
                isDollar={creditInDollars}
                setIsDollar={setCreditInDollars}
              />
            </span>
          </span>
        </span>
      </div>
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
