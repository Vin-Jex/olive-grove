import React, { useState } from "react";
import { Search } from "@mui/icons-material";

interface SearchInputProps {
  placeholder?: string;
  searchResults: any[];
  setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
  initialData: any[];
  shape: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  searchResults,
  shape,
  setSearchResults,
  initialData,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      className={`flex items-center justify-between bg-white border-[1.5px] !border-subtext/20 ${shape} px-3 py-2.5`}
    >
      <div className='flex items-center'>
        <Search className='h-5 w-5 text-subtext/60' />
        <input
          type='search'
          placeholder={placeholder || "Search"}
          className='ml-2 outline-none bg-transparent border-none focus:outline-none text-subtext placeholder:text-subtext min-w-[400px]'
          value={searchValue}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default SearchInput;
