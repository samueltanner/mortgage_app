import { CashflowObject, OptimizedLoans } from '@/lib/types'
import { useEffect, useState } from 'react'
interface IncomeAndExpensesProps {
  monthlyCashflowObj: CashflowObject
  setMonthlyCashflowObj: (cashflowObj: CashflowObject) => void
  optimizedLoans: OptimizedLoans | undefined
  selectedLoan: string | null
  propertyData: any
  totalCashflow: any
}
export const IncomeAndExpensesCard = ({
  monthlyCashflowObj,
  setMonthlyCashflowObj,
  optimizedLoans,
  selectedLoan,
  propertyData,
  totalCashflow,
}: IncomeAndExpensesProps) => {
  const [IOPiggyBack, setIOPiggyBack] = useState<boolean>(false)
  const [tempCashflowObject, setTempCashflowObject] =
    useState<CashflowObject>(monthlyCashflowObj)

  const handleChangeCashflowObj = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof CashflowObject,
  ) => {
    const value = e.target.value
    const newCashflowObj = { ...monthlyCashflowObj }
    if (value === '') {
      newCashflowObj[key] = 0
    } else {
      newCashflowObj[key] = Number(value)
    }
    setMonthlyCashflowObj(newCashflowObj)
  }

  const getMortgageInsurance = () => {
    if (!optimizedLoans || !selectedLoan) return 0
    const loan = optimizedLoans?.[selectedLoan!]?.mortgageInsurance || 0
    return loan
  }

  const getPrincipalAndInterest = () => {
    if (!optimizedLoans || !selectedLoan) return 0
    const primaryLoan = optimizedLoans?.[selectedLoan!].primaryLoanPI || 0
    const secondaryLoanPI = optimizedLoans?.[selectedLoan!].secondaryLoanPI || 0
    const secondaryLoanIO = optimizedLoans?.[selectedLoan!].secondaryLoanIO || 0
    return IOPiggyBack
      ? primaryLoan + secondaryLoanIO
      : primaryLoan + secondaryLoanPI
  }

  useEffect(() => {
    if (propertyData) {
      const newCashflowObj = { ...monthlyCashflowObj }
      newCashflowObj['hoa_fees'] = propertyData.hoa.payment || 0
      newCashflowObj['property_taxes'] =
        propertyData.payment_info.property_taxes
      newCashflowObj['homeowners_insurance'] =
        propertyData.payment_info.homeowners_insurance
      newCashflowObj['mortgage_insurance'] = getMortgageInsurance()
      newCashflowObj['principal_and_interest'] = getPrincipalAndInterest()
      setMonthlyCashflowObj(newCashflowObj)
    }
  }, [propertyData, optimizedLoans, selectedLoan, IOPiggyBack])

  useEffect(() => {
    setTempCashflowObject(monthlyCashflowObj)
  }, [monthlyCashflowObj])

  const getAffordabilityRatios = (): {
    [key: string]: number
    totalHouseCosts: number
    dti: number
    her: number
    ter: number
    tsr: number
  } => {
    const houseDebt =
      monthlyCashflowObj.homeowners_insurance +
      monthlyCashflowObj.principal_and_interest +
      monthlyCashflowObj.property_taxes +
      monthlyCashflowObj.mortgage_insurance +
      monthlyCashflowObj.hoa_fees
    const houseNonDebtExpenses =
      monthlyCashflowObj.utilities + monthlyCashflowObj.household_maintenance
    const totalHouseCosts =
      monthlyCashflowObj.hoa_fees + houseNonDebtExpenses + houseDebt
    const monthlyDebt =
      monthlyCashflowObj.monthly_household_expenses + houseDebt
    const monthlyExpenses = monthlyDebt + totalHouseCosts
    const monthlyIncome =
      monthlyCashflowObj.monthly_household_income +
      monthlyCashflowObj.rental_income

    const dti =
      isFinite(monthlyDebt) && monthlyIncome > 0
        ? (monthlyDebt / monthlyIncome) * 100
        : 0
    const housing_expense_ratio =
      isFinite(monthlyIncome) && monthlyIncome > 0
        ? (totalHouseCosts / monthlyIncome) * 100
        : 0
    const twenty_eight_rule =
      isFinite(monthlyIncome) && monthlyIncome > 0
        ? (totalHouseCosts / monthlyIncome) * 100
        : 0
    const thirty_six_rule =
      isFinite(monthlyIncome) && monthlyIncome > 0
        ? (monthlyExpenses / monthlyIncome) * 100
        : 0
    return {
      totalHouseCosts: totalHouseCosts,
      dti: dti,
      her: housing_expense_ratio,
      ter: twenty_eight_rule,
      tsr: thirty_six_rule,
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Monthly Income & Expenses</h1>
      <div className="flex flex-col gap-2">
        <span className="flex flex-col">
          <label htmlFor="household-income">Monthly Income</label>
          <input
            id="household-income"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={monthlyCashflowObj.monthly_household_income || undefined}
            onChange={(e) =>
              handleChangeCashflowObj(e, 'monthly_household_income')
            }
          />
        </span>
        <span className="flex flex-col">
          <label htmlFor="household-expenses">Monthly Debt</label>
          <input
            id="household-expenses"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={monthlyCashflowObj.monthly_household_expenses || undefined}
            onChange={(e) =>
              handleChangeCashflowObj(e, 'monthly_household_expenses')
            }
          />
        </span>

        <span className="flex flex-col">
          <label htmlFor="rental-income">Rental Income</label>
          <input
            id="rental-income"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={monthlyCashflowObj.rental_income || ''}
            onChange={(e) => handleChangeCashflowObj(e, 'rental_income')}
          />
        </span>
        <span className="flex flex-col">
          <label htmlFor="principal-interest">Principal & Interest</label>
          <span className="flex gap-2">
            <input
              id="principal-interest"
              type="number"
              className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
              value={
                monthlyCashflowObj?.principal_and_interest ||
                getPrincipalAndInterest() ||
                undefined
              }
              onChange={(e) =>
                handleChangeCashflowObj(e, 'principal_and_interest')
              }
            />

            {selectedLoan === 'piggy_back' && (
              <>
                <input
                  type="checkbox"
                  id="interest-only-piggy-back"
                  onClick={() => setIOPiggyBack(!IOPiggyBack)}
                />
                <label htmlFor="interest-only-piggy-back">
                  Interest Only Piggy Back
                </label>
              </>
            )}
          </span>
        </span>
        <span className="flex flex-col">
          <label htmlFor="property-taxes">Property Taxes</label>
          <input
            id="property-taxes"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={
              monthlyCashflowObj.property_taxes || undefined
              // propertyData?.payment_info?.property_taxes
            }
            onChange={(e) => handleChangeCashflowObj(e, 'property_taxes')}
          />
        </span>
        <span className="flex flex-col">
          <label htmlFor="mortgage-insurance">Mortgage Insurance</label>
          <input
            id="mortgage-insurance"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={
              monthlyCashflowObj.mortgage_insurance ||
              // getMortgageInsurance() ||
              undefined
            }
            onChange={(e) => handleChangeCashflowObj(e, 'mortgage_insurance')}
          />
        </span>
        <span className="flex flex-col">
          <label htmlFor="homeowners-insurance">
            Homeowners&apos; Insurance
          </label>
          <input
            id="homeowners-insurance"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={monthlyCashflowObj.homeowners_insurance || undefined}
            onChange={(e) => handleChangeCashflowObj(e, 'homeowners_insurance')}
          />
        </span>
        <span className="flex flex-col">
          <label htmlFor="hoa-dues">HOA Dues</label>
          <input
            id="hoa-dues"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={
              monthlyCashflowObj.hoa_fees ||
              // propertyData?.hoa?.payment ||
              undefined
            }
            onChange={(e) => handleChangeCashflowObj(e, 'hoa_fees')}
          />
        </span>
        <span className="flex flex-col">
          <label htmlFor="utilities">Utilities</label>
          <input
            id="utilities"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={monthlyCashflowObj.utilities || undefined}
            onChange={(e) => handleChangeCashflowObj(e, 'utilities')}
          />
        </span>
        <span className="flex flex-col">
          <label htmlFor="maintenance">Household Maintenance</label>
          <input
            id="maintenance"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
            value={monthlyCashflowObj.household_maintenance || undefined}
            onChange={(e) =>
              handleChangeCashflowObj(e, 'household_maintenance')
            }
          />
        </span>
        <hr className="my-2 border-slate-900" />
        <div>
          <span>
            <h1 className="text-md font-bold">Total House-Related Expenses</h1>
            <p>${getAffordabilityRatios().totalHouseCosts}</p>
          </span>
          {!!monthlyCashflowObj.rental_income && (
            <span>
              <h1 className="text-md font-bold">Net House-Related Cashflow</h1>
              <p>
                $
                {getAffordabilityRatios().totalHouseCosts -
                  monthlyCashflowObj.rental_income}
              </p>
            </span>
          )}
          <span
            className={`${
              getAffordabilityRatios().dti > 43
                ? 'text-red-500'
                : 'text-teal-500'
            }`}
          >
            <h1 className="text-md font-bold">Debt to Income Ratio</h1>
            <p>{getAffordabilityRatios().dti.toFixed(2)}%</p>
          </span>
          <span
            className={`${
              getAffordabilityRatios().her > 28
                ? 'text-red-500'
                : 'text-teal-500'
            }`}
          >
            <h1 className="text-md font-bold">Housing Expense Ratio</h1>
            <p>{getAffordabilityRatios().her.toFixed(2)}%</p>
          </span>
          <span>
            <h1
              className={`${
                getAffordabilityRatios().ter > 28 ||
                getAffordabilityRatios().tsr > 36
                  ? 'text-red-500'
                  : 'text-teal-500'
              } text-md font-bold`}
            >
              28/36 Rule
            </h1>
            <span className="flex gap-1">
              <p
                className={`${
                  getAffordabilityRatios().ter > 28
                    ? 'text-red-500'
                    : 'text-teal-500'
                }`}
              >
                {getAffordabilityRatios().ter.toFixed(2)}%
              </p>
              <p>/</p>
              <p
                className={`${
                  getAffordabilityRatios().tsr > 36
                    ? 'text-red-500'
                    : 'text-teal-500'
                }`}
              >
                {' '}
                {getAffordabilityRatios().tsr.toFixed(2)}%
              </p>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
