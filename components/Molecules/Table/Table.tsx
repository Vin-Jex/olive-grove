import React from "react";
import { truncateAndElipses } from "../Card/TeacherSubjectCard";

interface TableProps<T> {
  columns: Array<Column<T>>;
  data: T[];
  onRowClick?: (row: T) => void;
  actions?: Array<Action<T>>;
}

interface Column<T> {
  Header: string;
  accessor: string;
  Cell?: (props: { value: any }) => JSX.Element;
}

interface Action<T> {
  title: string;
  onClick: (data: T) => void;
  icon?: JSX.Element;
}

const getValueFromPath = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return acc[part];
    }
    const match = part.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const [, key, index] = match;
      return acc[key] ? acc[key][parseInt(index, 10)] : undefined;
    }
    return undefined;
  }, obj);
};

export const Table = <T,>({
  columns,
  data,
  onRowClick,
  actions,
}: TableProps<T>) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full table-auto !shadow-md rounded-sm bg-white'>
        <thead>
          <tr className='bg-white text-dark'>
            {columns.map((column, index) => (
              <th key={index} className='px-5 py-4 border-b !text-start'>
                {column.Header}
              </th>
            ))}
            {actions && (
              <th className='px-5 py-4 border-b !text-start'>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className='px-4 py-4 text-center text-gray-500'
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`cursor-pointer hover:bg-gray-50 ${
                  index === data.length - 1 ? "last:border-b-0 hover:last:border-b" : "border-b"
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={`px-4 py-2 `}>
                    {column.Cell
                      ? column.Cell({
                          value: truncateAndElipses(
                            getValueFromPath(row, column.accessor),
                            30
                          ),
                        })
                      : truncateAndElipses(
                          getValueFromPath(row, column.accessor),
                          30
                        )}
                  </td>
                ))}
                {actions && (
                  <td className='px-4 py-3 flex space-x-2'>
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        className='py-2 px-2 text-sm text-gray-800 hover:bg-gray-100 flex items-center justify-center'
                      >
                        {action.icon ? action.icon : action.title}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
