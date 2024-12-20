import React, { useState } from "react";
import { Search } from "@mui/icons-material";
import { THandleSearchChange } from "../utils/types";

interface SearchInputProps {
  placeholder?: string;
  searchResults: any[];
  setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
  initialData: any[];
  shape: string;
  handleInputChange?: THandleSearchChange<any>;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  searchResults,
  shape,
  setSearchResults,
  initialData,
  handleInputChange,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const customHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchValue(inputValue);

    // Perform filtering based on input value
    const filteredResults = initialData.filter((result) => {
      // Add checks to prevent null or undefined access errors
      const studentName = result?.student?.name?.toLowerCase() || "";
      const submissionDate = result?.submissionDate?.toLowerCase() || "";

      return (
        studentName.includes(inputValue) || submissionDate.includes(inputValue)
      );
    });

    setSearchResults(filteredResults);
  };

  return (
    <div
      className={`flex items-center justify-between border-[1.5px] !border-subtext/20 ${shape} px-3 py-2.5`}
    >
      <div className="flex items-center">
        {/* <Search className="h-5 w-5 text-subtext/60" /> */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.0772 12.1L14.6438 14.6667M13.833 7.58337C13.833 9.24098 13.1745 10.8307 12.0024 12.0028C10.8303 13.1749 9.24061 13.8334 7.58301 13.8334C5.9254 13.8334 4.33569 13.1749 3.16359 12.0028C1.99149 10.8307 1.33301 9.24098 1.33301 7.58337C1.33301 5.92577 1.99149 4.33606 3.16359 3.16396C4.33569 1.99185 5.9254 1.33337 7.58301 1.33337C9.24061 1.33337 10.8303 1.99185 12.0024 3.16396C13.1745 4.33606 13.833 5.92577 13.833 7.58337Z"
            stroke="#1E1E1E"
            stroke-opacity="0.6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <input
          type="search"
          placeholder={placeholder || "Search"}
          className="ml-2 outline-none bg-transparent border-none focus:outline-none text-subtext placeholder:text-subtext min-w-[400px]"
          value={searchValue}
          onChange={
            handleInputChange
              ? (e) =>
                  handleInputChange(e, {
                    setSearchResults,
                    setSearchValue,
                    initialData,
                  })
              : customHandleInputChange
          }
        />
      </div>
    </div>
  );
};

export default SearchInput;
