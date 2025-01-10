import React, { Dispatch, FC, SetStateAction } from 'react';
import Input from '../Atoms/Input';

const SearchLayout: FC<{
  value: string;
  onChange: Dispatch<SetStateAction<string | string[]>>;
}> = ({ value, onChange }) => {
  return (
    <div className='relative overflow-hidden'>
      <span className='absolute z-10 h-full top-[48%] -translate-y-1/2 left-2.5 flex items-center justify-center'>
        <svg
          width='14'
          height='14'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12.0772 12.1L14.6438 14.6667M13.833 7.58337C13.833 9.24098 13.1745 10.8307 12.0024 12.0028C10.8303 13.1749 9.24061 13.8334 7.58301 13.8334C5.9254 13.8334 4.33569 13.1749 3.16359 12.0028C1.99149 10.8307 1.33301 9.24098 1.33301 7.58337C1.33301 5.92577 1.99149 4.33606 3.16359 3.16396C4.33569 1.99185 5.9254 1.33337 7.58301 1.33337C9.24061 1.33337 10.8303 1.99185 12.0024 3.16396C13.1745 4.33606 13.833 5.92577 13.833 7.58337Z'
            stroke='#1E1E1E99'
            strokeOpacity='0.6'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>

      <Input
        value={value}
        type='search'
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search'
        className='!w-[20rem] pl-7 pb-2.5 text-subtext'
      />
    </div>
  );
};


export default SearchLayout;
