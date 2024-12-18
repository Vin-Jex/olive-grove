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
  required,
  onChange,
  placeholder,
  reduceWidth,
  value,
  inputSize: size,
  ...otherAtributes
}) => {
  return (
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
      } h-full outline-none border-[1.5px] border-dark/20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext ${
        otherAtributes.className || ""
      }`}
    >
      {placeholder && <option value={undefined}>{placeholder}</option>}
      {options.map((each_option, index) => (
        <option
          key={index}
          value={
            typeof each_option === "string" ? each_option : each_option.value
          }
          className="h-full capitalize"
        >
          {typeof each_option === "string"
            ? each_option
            : each_option.display_value || each_option.value}
        </option>
      ))}
    </select>
  );
};

export default Select;
