import { Search } from '@mui/icons-material';
import React, { Dispatch, FC, SetStateAction } from 'react';
import Input from '../Atoms/Input';

const SearchLayout: FC<{
  value: string;
  onChange: Dispatch<SetStateAction<string | string[]>>;
}> = ({ value, onChange }) => {
  return (
    <div className='relative'>
      <span className='absolute grid place-items-center z-10 h-full  top-0 left-2'>
        <Search className='text-gray-400' />
      </span>
      <Input
        value={value}
        type='search'
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search'
        className='!w-[20rem] pl-8 px-3 py-2 rounded-md'
      />
    </div>
  );
};

export default SearchLayout;
