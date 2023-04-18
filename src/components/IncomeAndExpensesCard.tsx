export const IncomeAndExpensesCard = ({}) => {
  return (
    <div>
      <h1 className="text-xl font-bold">Income & Expenses</h1>
      <div className="flex flex-col gap-2">
        <span className="flex flex-col">
          <label htmlFor="household-income">Monthly Household Income</label>
          <input
            id="household-income"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          />
        </span>

        <span className="flex flex-col">
          <label htmlFor="household-expenses">Monthly Household Expenses</label>
          <input
            id="household-expenses"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          />
        </span>

        <span className="flex flex-col">
          <label htmlFor="household-expenses">Rental Income</label>
          <input
            id="household-expenses"
            type="number"
            className="w-[40%] rounded-md border-2 border-slate-900 bg-gray-50 px-2"
          />
        </span>
      </div>
    </div>
  )
}
