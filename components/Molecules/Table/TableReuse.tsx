import Image from "next/image";
import React from "react";

interface TableProps {
  action?: boolean;
  data: any[]; // Your data array
  columns: { label: string; key: string }[]; // Array of column labels and keys
}

const TableReuse: React.FC<TableProps> = ({ data, columns, action = true }) => {
  return (
    <div className='w-full overflow-x-auto overflow-hidden rounded-xl border-2'>
      <table className='w-full table-fixed'>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`text-left py-4 px-6 last:!w-[200px]`}
              >
                {col.label}
              </th>
            ))}
            {action && <th className='!w-[120px]'>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className='h-full'>
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`border-t-[1.5px] border-r-[1.5px] px-6 py-4 text-subtext text-sm font-roboto font-medium`}
                >
                  {colIndex === 0 ? (
                    <div className='flex items-center space-x-4'>
                      <Image
                        src={row[col.key].profile || "/placeholder.jpg"}
                        alt='Profile Image'
                        width='40'
                        height='40'
                        className='w-8 h-8 object-cover rounded-full'
                      />
                      <span className=''>{row[col.key].name}</span>
                    </div>
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              {action && (
                <td className='border-t-[1.5px] w-fit'>
                  <div className='flex justify-evenly items-center !h-full'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='30'
                      height='30'
                      viewBox='0 0 16 16'
                      fill='none'
                      className='cursor-pointer'
                    >
                      <path
                        d='M7.99996 10.6666L4.66663 7.33329L5.59996 6.36663L7.33329 8.09996V2.66663H8.66663V8.09996L10.4 6.36663L11.3333 7.33329L7.99996 10.6666ZM3.99996 13.3333C3.63329 13.3333 3.31929 13.2026 3.05796 12.9413C2.79663 12.68 2.66618 12.3662 2.66663 12V9.99996H3.99996V12H12V9.99996H13.3333V12C13.3333 12.3666 13.2026 12.6806 12.9413 12.942C12.68 13.2033 12.3662 13.3337 12 13.3333H3.99996Z'
                        fill='#32A8C4'
                      />
                    </svg>

                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='28'
                      height='28'
                      viewBox='0 0 16 16'
                      fill='none'
                      className='cursor-pointer'
                    >
                      <path
                        d='M4.66663 14C4.29996 14 3.98596 13.8693 3.72463 13.608C3.46329 13.3467 3.33285 13.0329 3.33329 12.6667V4H2.66663V2.66667H5.99996V2H9.99996V2.66667H13.3333V4H12.6666V12.6667C12.6666 13.0333 12.536 13.3473 12.2746 13.6087C12.0133 13.87 11.6995 14.0004 11.3333 14H4.66663ZM11.3333 4H4.66663V12.6667H11.3333V4ZM5.99996 11.3333H7.33329V5.33333H5.99996V11.3333ZM8.66663 11.3333H9.99996V5.33333H8.66663V11.3333Z'
                        fill='#32A8C4'
                      />
                    </svg>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableReuse;
