import { useTable, HeaderGroup, Row, Cell } from 'react-table'
import { useMemo } from 'react'
import { getLoanString } from '@/lib/helpers'
interface LoanTableData {
  [key: string]: any
  radio: string | undefined
  loan_type: string
  viable: boolean | undefined
  interest_rate: string | undefined
  down_payment: number | undefined
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
                      <>
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

                        {/* <input
                          type="radio"
                          name="loanGroup"
                          value={cell.value}
                          checked={selectedLoan === cell.value}
                          onClick={() => {
                            handleSelectLoan(row)
                          }}
                          className="form-radio h-5 w-5 text-green-500"
                        /> */}
                      </>
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
