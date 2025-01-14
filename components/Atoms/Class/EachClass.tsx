import { TableCol, TableRow } from "@/components/Molecules/Table/Table";
import { TDepartment } from "@/components/utils/types";
import React, { FC } from "react";

const EachClass: FC<{
  data: TDepartment;
  toogleModalEdit: (a: TDepartment) => void;
  toogleModalDelete: (a: TDepartment) => void;
}> = ({ data, toogleModalEdit, toogleModalDelete }) => {
  return (
    <TableRow>
      <TableCol className='max-w-[45%]'>{data.name}</TableCol>
      <TableCol className='max-w-[45%]'>{data.category}</TableCol>
      <TableCol className='min-w-[10%] flex gap-4'>
        <i
          className='fas fa-pencil transition hover:scale-110'
          onClick={() =>
            toogleModalEdit({
              category: data.category,
              name: data.name,
              description: data.description,
              _id: data._id,
            })
          }
        ></i>
        <i
          className='fas fa-trash text-red-400 transition hover:scale-110'
          onClick={() =>
            toogleModalDelete({
              category: data.category,
              name: data.name,
              description: data.description,
              _id: data._id,
            })
          }
        ></i>
      </TableCol>
    </TableRow>
  );
};

export default EachClass;
