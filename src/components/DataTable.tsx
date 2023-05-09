import { useTable, HeaderGroup, Column, Row, Cell } from 'react-table'
import { useMemo } from 'react'
import { getLoanString } from '@/lib/helpers'
interface LoanTableData {
  radio: string
  loan_type: string
  viable: boolean
  interest_rate: number
  down_payment: number
  monthly_pi: number
  mortgage_insurance: number
  loan_max: number
  loan_amount: number
  equity: number
  sec_monthly_pi: number
  sec_monthly_io: number
  sec_interest_rate: number
  sec_loan_amount: number
}
interface DataTableProps {
  data: any[]
  columns: readonly Column<LoanTableData>[]
  selectedLoan: string | null
  setSelectedLoan: (loan: string) => void
}

export const DataTable = ({
  data,
  columns,
  selectedLoan,
  setSelectedLoan,
}: DataTableProps) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<LoanTableData>({ columns, data })

  const handleSelectLoan = (row: Row<LoanTableData>) => {
    if (row.original.viable === false) return
    setSelectedLoan(row.original.loan_type)
  }

  return (
    <table {...getTableProps()} className="cursor-pointer">
      <thead>
        {headerGroups.map((headerGroup, headerGroupIndex) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
            {headerGroup.headers.map((column, columnIndex) => (
              <th
                {...column.getHeaderProps()}
                key={columnIndex}
                className="px-2 text-left text-sm"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <td
                  {...cell.getCellProps()}
                  key={cellIndex}
                  className={`${
                    row?.original?.viable === true
                      ? 'text-slate-900'
                      : 'text-gray-300'
                  } p-2`}
                  onClick={() => {
                    handleSelectLoan(row)
                  }}
                >
                  <>
                    {cellIndex === 0 && (
                      <input
                        type="radio"
                        name="loanGroup"
                        value={cell.value}
                        checked={selectedLoan === cell.value}
                        onClick={() => {
                          handleSelectLoan(row)
                        }}
                      />
                    )}
                    {cellIndex === 1 && (
                      <p
                        className={`${
                          row.original.loan_type === selectedLoan &&
                          'font-bold text-teal-500'
                        }`}
                      >
                        {getLoanString(cell.value)}
                      </p>
                    )}
                    {cellIndex > 1 && cell.render('Cell')}
                  </>
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
