import { Info } from "@mui/icons-material";
import React, {
  ChangeEvent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import Input from "./Input";
import Select from "./Select";
import { InputType, TSelectOptions } from "../utils/types";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type: InputType;
  pattern?: string;
  className?: string;
  title?: string;
  label?: string;
  value: string | number | readonly string[] | undefined;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error: string;
  options?: TSelectOptions;
  inputSize?: "xs" | "sm";
  reduceWidth?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type,
  pattern,
  title,
  label,
  value,
  onChange,
  className,
  placeholder,
  required,
  error,
  disabled,
  options,
  inputSize,
  reduceWidth,
  ...inputProps
}) => (
  <div className='w-full flex flex-col gap-1'>
    {error && (
      <span className='flex items-center gap-x-1 text-sm font-roboto font-normal text-[#F6CE46]'>
        <Info sx={{ fontSize: "1.1rem" }} />
        {error}
      </span>
    )}
    {label && (
      <label
        htmlFor={name}
        className='text-sm font-roboto font-medium text-subtext'
      >
        {label}
      </label>
    )}
    {type === "select" && options ? (
      <Select
        name={name}
        options={options}
        required={required}
        disabled={disabled}
        value={value as any}
        onChange={onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
        placeholder={placeholder}
        className={className}
        reduceWidth={reduceWidth}
        inputSize={inputSize}
        {...(inputProps as SelectHTMLAttributes<HTMLSelectElement>)}
      />
    ) : type === "textarea" ? (
      <textarea
        id={name}
        name={name}
        disabled={disabled}
        className={`input !py-3 mx-auto min-h-36 ${className}`}
        placeholder={placeholder}
        value={value as string}
        onChange={onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
        required={required}
        {...(inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    ) : (
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
        {...inputProps}
      />
    )}
  </div>
);

export default InputField;
