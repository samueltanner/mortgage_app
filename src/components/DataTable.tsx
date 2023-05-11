import { useTable, HeaderGroup, Row, Cell } from 'react-table'
import { useMemo } from 'react'
import { getLoanString } from '@/lib/helpers'
interface LoanTableData {
  [key: string]: any
  loan_type: string
  viable: boolean | undefined
  interest_rate: string | undefined
  down_payment: string | undefined
  monthly_pi: number | undefined
  mortgage_insurance: number | undefined
  loan_max: number | undefined
  loan_amount: number | undefined
  equity: number | undefined
  sec_monthly_pi: number | undefined
  sec_monthly_io: number | undefined
  sec_interest_rate: number | undefined
  sec_loan_amount: number | undefined
}

interface Column<T extends Record<string, unknown>> {
  Header: string
  accessor: string
}
interface DataTableProps {
  data: LoanTableData[]
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
    <table {...getTableProps()} className="relative cursor-pointer">
      <thead>
        {headerGroups.map((headerGroup, headerIndex) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerIndex}>
            {headerGroup.headers.map((column, columnIndex) => (
              <th
                {...column.getHeaderProps()}
                key={columnIndex}
                className={`${
                  columnIndex === 0 && 'sticky left-0 bg-gray-200'
                } px-2 text-left text-sm`}
                onClick={() => {
                  console.log(column)
                }}
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
                  }  p-4 ${cellIndex === 0 && 'sticky left-0 bg-gray-200'}`}
                  onClick={() => {
                    handleSelectLoan(row)
                  }}
                >
                  <span className="flex flex-nowrap items-center gap-2">
                    {cellIndex === 0 && (
                      <span
                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                          selectedLoan === cell.value
                            ? 'border-teal-500'
                            : 'border-slate-900'
                        } `}
                      >
                        {selectedLoan === cell.value && (
                          <span className="inline-block h-2 w-2 rounded-full bg-teal-500" />
                        )}
                      </span>
                    )}
                    {cellIndex === 0 && (
                      <p
                        className={`${
                          row.original.loan_type === selectedLoan &&
                          'font-bold text-teal-500'
                        }`}
                      >
                        {getLoanString(cell.value)}
                      </p>
                    )}
                    {cellIndex > 0 && cell.render('Cell')}
                  </span>
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
