import { ChangeEvent, FC } from 'react';
import { TSelectOptions } from '../utils/types';

const Select: FC<{
  options: TSelectOptions;
  name: string;
  className?: string;
  required: boolean;
  placeholder: string;
  reduceWidth?: boolean;
  value?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}> = ({
  options,
  name,
  className,
  required,
  onChange,
  placeholder,
  reduceWidth,
  value,
}) => {
  return (
    <select
      name={name}
      required={required}
      onChange={(e) => onChange(e)}
      placeholder={placeholder}
      style={{borderColor: '#e5e7eb', outlineColor: '#e5e7eb'}}
      {...(value ? { value: value } : {})}
      className={`input px-2 sm:px-2.5 py-3.5 !rounded-lg capitalize ${className} ${
        reduceWidth ? 'md:w-[200px]' : ''
      } h-full outline-none border text-xs border-gray-200 *:sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext`}
    >
      <option value={undefined}>{placeholder}</option>
      {options.map((each_option, index) => (
        <option
          key={index}
          value={
            typeof each_option === 'string' ? each_option : each_option.value
          }
          className='h-full capitalize'
        >
          {typeof each_option === 'string'
            ? each_option
            : each_option.display_value || each_option.value}
        </option>
      ))}
    </select>
  );
};

export default Select;
