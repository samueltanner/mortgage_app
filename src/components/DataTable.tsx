import { useTable, HeaderGroup, Column, Row, Cell } from 'react-table'
import { useMemo } from 'react'

interface DataTableProps {
  data: any[]
  columns: Column[]
}

export const DataTable = ({ data, columns }: DataTableProps) => {
  interface MyData {
    loan_type: string
    col2: string
    viable: boolean
  }

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<MyData>({ columns, data })

  return (
    <table {...getTableProps()}>
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
            <tr
              {...row.getRowProps()}
              key={rowIndex}
              onClick={() => console.log(row)}
            >
              {row.cells.map((cell, cellIndex) => (
                <td
                  {...cell.getCellProps()}
                  key={cellIndex}
                  className={`${
                    row?.original?.viable === true
                      ? 'text-slate-900'
                      : 'text-gray-300'
                  }`}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
