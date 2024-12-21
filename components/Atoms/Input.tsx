import { InfoOutlined } from '@mui/icons-material';
import React, { InputHTMLAttributes, useState } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

export type InputType =
  | 'button'
  | 'text'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'time'
  | 'week'
  | 'url';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  validationError?: string;
  hideIcon?:
    | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
      })
    | any;
  showIcon?:
    | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
      })
    | any;
  isValid?: boolean | undefined;
  handleInputChange?: React.ChangeEvent<HTMLInputElement>;
  inputWidth?: number | string;
  status?: string;
  type?: InputType;
}

const Input: React.FC<InputProps> = ({
  className,
  validationError, // Error message
  isValid, // Boolean
  handleInputChange, // Function
  inputWidth, // Input size
  hideIcon: HideIcon, // Icon (HTML Element)
  showIcon: ShowIcon, // Icon (HTML Element)
  status, // Accepts warning, error, success strings only
  type: Type, // Input Type
  ...inputProps // Other properties
}) => {
  // const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const [showInput, setShowInput] = useState<boolean | undefined>(false);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = event.target.value;
  //   // Add your validation logic here
  //   // Example validation: Input should not be empty
  //   setIsValid(inputValue.trim() !== "");
  // };

  const showInputField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowInput(!showInput);
  };

  const statusColor =
    status === 'success'
      ? '#06C270'
      : status === 'warning'
      ? '#FFCC00'
      : status === 'error'
      ? '#FF3B3B'
      : '#1E1E1E60';
  return (
    <div
      className='space-y-1 w-full'
      style={{
        width:
          inputWidth && typeof inputWidth === 'string'
            ? ''
            : inputWidth && typeof inputWidth === 'number'
            ? '' + 'px'
            : '',
      }}
    >
      <div className='flex relative items-center w-full'>
        <input
          type={showInput ? '' : Type}
          {...inputProps}
          className={`${className}  px-3 relative py-2 placeholder:text-sm placeholder:mt-1 !border-gray-200 rounded-lg`}
          style={{
            width: '100%',
            border: `1.5px solid ${statusColor}`,
            outline: 'none',
          }}
        />
        {ShowIcon && showInput ? (
          <ShowIcon
            className='absolute right-3 top-1/2 -translate-y-1/2 text-subtext !text-[1.4rem]'
            onClick={showInputField}
          />
        ) : HideIcon && !showInput ? (
          <HideIcon
            className='absolute right-3 top-1/2 -translate-y-1/2 text-subtext !text-[1.4rem]'
            onClick={showInputField}
          />
        ) : (
          ''
        )}
      </div>
      {validationError && isValid && (
        <div className='flex items-center space-x-1'>
          <span className='flex items-center'>
            <InfoOutlined
              sx={{ fontSize: '1.2rem', color: `${statusColor}` }}
            />
          </span>
          <p style={{ color: `${statusColor}` }}>{validationError}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
