import { FC } from "react";
import { capitalize } from "../utils/utils";

const Select: FC<{ options: string[]; name: string; required: boolean }> = ({
  options,
  name,
  required,
}) => {
  return (
    <select
      name={name}
      required={required}
      className="flex items-center px-2 sm:px-2.5 py-3.5 rounded-xl bg-transparent !border-[#D0D5DD] font-roboto font-normal w-[200px] h-full outline-none border-[1.5px] border-dark/20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext"
    >
      {options.map((each_option) => (
        <>
          <option value={each_option} className="h-full">
            {capitalize(each_option)}
          </option>
        </>
      ))}
    </select>
  );
};

export default Select;
