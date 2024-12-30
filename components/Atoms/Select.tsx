import {
  ChangeEvent,
  DetailedHTMLProps,
  FC,
  SelectHTMLAttributes,
} from "react";
import { TSelectOptions } from "../utils/types";

const Select: FC<
  {
    options: TSelectOptions;
    name: string;
    required?: boolean;
    placeholder?: string;
    reduceWidth?: boolean;
    value?: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    inputSize?: "xs" | "sm";
  } & DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
> = ({
  options,
  name,
  className,
  required,
  onChange,
  placeholder,
  reduceWidth,
  value,
  inputSize: size,
  ...otherAtributes
}) => {
  return (
    // <select
    //   name={name}
    //   required={required}
    //   onChange={(e) => onChange(e)}
    //   placeholder={placeholder}
    //   {...(value ? { value: value } : {})}
    //   {...otherAtributes}
    //   className={`input px-2 sm:px-2.5 ${
    //     size === "xs" ? "!py-1.5" : size === "sm" ? "!py-2.5" : "!py-3.5"
    //   } !rounded-lg capitalize ${
    //     reduceWidth ? "md:w-[200px]" : ""
    //   } h-full outline-none border-[1.5px] border-dark/20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext ${
    //     otherAtributes.className || ""
    //   }`}
    // >
    //   {placeholder && <option value={undefined}>{placeholder}</option>}
    //   {options.map((each_option, index) => (
    //     <option
    //       key={index}
    //       value={
    //         typeof each_option === "string" ? each_option : each_option.value
    //       }
    //       className="h-full capitalize"
    //     >
    //       {typeof each_option === "string"
    //         ? each_option
    //         : each_option.display_value || each_option.value}
    //     </option>
    //   ))}
    // </select>
    <div className={`w-full relative ${className || ""}`}>
      <select
        name={name}
        required={required}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
        {...(value ? { value: value } : {})}
        {...otherAtributes}
        className={`input px-2 sm:px-2.5 ${
          size === "xs" ? "!py-1.5" : size === "sm" ? "!py-2.5" : "!py-3.5"
        } !rounded-lg capitalize ${
          reduceWidth ? "md:w-[200px]" : ""
        } h-full outline-none border-[1.5px] border-dark/20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext  appearance-none focus:outline-none !pr-10`}
      >
        {placeholder && (
          <option value={undefined} disabled>
            {placeholder}
          </option>
        )}
        {options.map((each_option, index) => (
          <option
            key={index}
            value={
              typeof each_option === "string" ? each_option : each_option.value
            }
            className='h-full capitalize'
          >
            {typeof each_option === "string"
              ? each_option
              : each_option.display_value || each_option.value}
          </option>
        ))}
      </select>
      {/* Custom Caret-Down Icon */}
      <div className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5 text-gray-500'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 011.06-.02L10 10.94l3.71-3.75a.75.75 0 011.08 1.04l-4.25 4.29a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z'
            clipRule='evenodd'
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;
