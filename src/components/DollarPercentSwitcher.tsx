import { FiPercent, FiDollarSign } from 'react-icons/fi'
import { useState } from 'react'

interface DollarPercentSwitcherProps {
  isDollar?: boolean
  setIsDollar: (isDollar: boolean) => void
}
export const DollarPercentSwitcher = ({
  isDollar = true,
  setIsDollar,
}: DollarPercentSwitcherProps) => {
  const selected =
    'border-2 border-teal-400 bg-teal-400 text-slate-900 hover:border-teal-400 hover:bg-teal-300'

  const unselected =
    'border-2 border-gray-200 bg-gray-200 hover:border-gray-400 hover:bg-gray-100'
  return (
    <span
      className=" flex h-fit rounded-md bg-gray-50"
      onClick={() => {
        setIsDollar(!isDollar)
      }}
    >
      <span className={`${isDollar ? selected : unselected} rounded-l-md p-1`}>
        <FiDollarSign className="h-4 w-4" />
      </span>
      <span className={`${!isDollar ? selected : unselected} rounded-r-md p-1`}>
        <FiPercent className="h-4 w-4" />
      </span>
    </span>
  )
}
