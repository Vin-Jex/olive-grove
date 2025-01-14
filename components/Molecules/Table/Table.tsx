import React, { FC, ReactNode } from "react";

export const Table: FC<{
  head_columns: (string | { value: string; className: string })[];
  data: Record<string, any>[];
  children: (data: any, i: number) => ReactNode;
}> = ({ head_columns, data, children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border-2">
      <table className="w-full min-w-[640px] table-auto">
        <thead>
          <tr>
            {head_columns.map((col, index) => (
              <th
                key={index}
                className={`text-left py-4 px-6 text-sm md:text-base whitespace-nowrap ${
                  typeof col === "string" ? col : col.className
                }`}
              >
                {typeof col === "string" ? col : col.value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(children)
          ) : (
            <tr>
              <td className="border-t-[1.5px]" colSpan={head_columns.length}>
                <div className="py-10 text-center">
                  <h2 className="text-lg font-semibold text-gray-700">
                    No Data Available
                  </h2>
                  <p className="text-sm text-gray-500">
                    There are no records to display at the moment.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <tr className="w-full">{children}</tr>;
};

export const TableCol: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <td
      className={`w-full border-t-[1.5px] border-r-[1.5px] px-6 py-4 text-xs md:text-sm text-subtext font-roboto font-medium ${className}`}
    >
      {children}
    </td>
  );
};
