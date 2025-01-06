import React, { useState } from 'react';

const FormPagination = (props: {
  number: number;
  index: number;
  isDisabled: boolean[];
  onChange: React.Dispatch<React.SetStateAction<number>>;
}) => {
  //   const [current, setCurrent] = useState(0);
  return (
    <div className='flex gap-4 py-4 mx-auto'>
      {Array.from({ length: props.number }, (_, i) => (
        <button
          disabled={i > props.index}
          key={i}
          onClick={() => {
            props.onChange(i);
          }}
          className={`${
            props.index === i ? 'bg-primary' : 'bg-gray-200'
          } w-3 h-3 border-2  rounded-full`}
        ></button>
      ))}
    </div>
  );
};

export default FormPagination;
