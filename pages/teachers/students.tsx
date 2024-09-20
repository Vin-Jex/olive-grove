import React, { useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import SearchInput from "@/components/Atoms/SearchInput";
import TableReuse from "@/components/Molecules/Table/TableReuse";
import Img from "@/public/image/student3.png";

const Students = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const columns = [
    { label: "Student Names", key: "student" },
    { label: "Class Work", key: "classWork" },
    { label: "Home Work", key: "homeWork" },
    { label: "Test", key: "test" },
    { label: "Assessment", key: "assessment" },
    { label: "Total", key: "total" },
  ];

  return (
    <TeachersWrapper title='Student' metaTitle='Olive Groove ~ Student'>
      <div className='space-y-5'>
        {/* Title */}
        <div className='flex flex-col'>
          <span className='text-lg font-medium text-dark font-roboto'>
            Students
          </span>
          <span className='text-md text-subtext font-roboto'>
            View student performances
          </span>
        </div>

        <div className='space-y-8 md:!my-12'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between w-full gap-y-4'>
            <select
              // value={formState.instituteType}
              name='subject'
              // onChange={handleChange}
              required
              className='flex items-center px-2 sm:px-2.5 py-3.5 rounded-xl bg-transparent !border-[#D0D5DD] font-roboto font-normal w-full md:w-[200px] h-full outline-none border-[1.5px] border-dark/20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext order-2'
            >
              <option value='mathematics' className='h-full'>
                Mathematics
              </option>
              <option value='english' className='h-full'>
                English
              </option>
            </select>

            <div className=''>
              <SearchInput
                shape='rounded-lg'
                placeholder='Search'
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                initialData={[]}
              />
            </div>
          </div>
          <TableReuse data={searchResults} columns={columns} action={false} />
        </div>
      </div>
    </TeachersWrapper>
  );
};

export default withAuth("Teacher", Students);
