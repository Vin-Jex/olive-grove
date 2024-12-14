import React, { Dispatch, FC, SetStateAction } from 'react';
import Input from '../Atoms/Input';

const SearchLayout: FC<{
  value: string;
  onChange: Dispatch<SetStateAction<string | string[]>>;
}> = ({ value, onChange }) => {
  return (
    <div className='relative'>
      <span className='absolute grid place-items-center z-10 h-full top-1/2 -translate-y-1/2 left-5'>
        <SearchIcon />
      </span>
      <Input
        value={value}
        type='search'
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search'
        className='!w-[20rem] placeholder:absolute placeholder:top-[0.52rem] !bg-inherit !bg-opacity-60 pl-11'
      />
    </div>
  );
};

function SearchIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      className='!text-gray-200 w-[14px]'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12.0772 12.1L14.6438 14.6667M13.833 7.58337C13.833 9.24098 13.1745 10.8307 12.0024 12.0028C10.8303 13.1749 9.24061 13.8334 7.58301 13.8334C5.9254 13.8334 4.33569 13.1749 3.16359 12.0028C1.99149 10.8307 1.33301 9.24098 1.33301 7.58337C1.33301 5.92577 1.99149 4.33606 3.16359 3.16396C4.33569 1.99185 5.9254 1.33337 7.58301 1.33337C9.24061 1.33337 10.8303 1.99185 12.0024 3.16396C13.1745 4.33606 13.833 5.92577 13.833 7.58337Z'
        stroke='#9ca3af'
        stroke-opacity='0.6'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
}

export default SearchLayout;
