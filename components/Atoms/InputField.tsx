import { Info } from '@mui/icons-material';
import React from 'react';
import { ChangeEvent } from 'react';
import Input, { InputType } from './Input';

interface InputFieldProps {
  name: string;
  type: InputType;
  pattern?: string;
  className?: string;
  title?: string;
  value: string | number | readonly string[] | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  error: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type,
  pattern,
  title,
  value,
  onChange,
  className,
  placeholder,
  required,
  error,
  disabled,
}) => (
  <label htmlFor={name} className='w-full flex flex-col gap-1'>
    {error && (
      <span className='flex items-center gap-x-1 text-sm font-roboto font-normal text-[#F6CE46]'>
        <Info sx={{ fontSize: '1.1rem' }} />
        {error}
      </span>
    )}
    <Input
      id={name}
      name={name}
      disabled={disabled}
      type={type}
      pattern={pattern}
      title={title}
      className={`input !py-3 mx-auto ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </label>
);

export default InputField;
