import React, { useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@/components/Molecules/WithAuth";
import SearchInput from "@/components/Atoms/SearchInput";
import TableReuse from "@/components/Molecules/Table/TableReuse";
import Img from "@/public/image/student3.png";
import AdminsWrapper from "@/components/Molecules/Layouts/Admin.Layout";

const data = [
  {
    id: 1,
    student: {
      name: "John Doe",
      profile: Img,
    },
    classWork: 55,
    homeWork: 66,
    assessment: 30,
    test: 69,
    total: 88,
  },
  {
    id: 2,
    student: {
      name: "Jane Doe",
      profile: Img,
    },
    classWork: 55,
    homeWork: 66,
    assessment: 30,
    test: 69,
    total: 98,
  },
  {
    id: 3,
    student: {
      name: "Smith Doe",
      profile: Img,
    },
    classWork: 55,
    homeWork: 66,
    assessment: 30,
    test: 69,
    total: 88,
  },
];
const Students = () => {
  const [searchResults, setSearchResults] = useState(data);

  const columns = [
    { label: "Student Names", key: "student" },
    { label: "Class Work", key: "classWork" },
    { label: "Home Work", key: "homeWork" },
    { label: "Test", key: "test" },
    { label: "Assessment", key: "assessment" },
    { label: "Total", key: "total" },
  ];

  return (
    <AdminsWrapper
      isPublic={false}
      title='Student'
      metaTitle='Olive Grove ~ Student'
    >
      <div className='p-12 space-y-5'>
        {/* Title */}
        <div className='flex flex-col'>
          <span className='text-lg font-medium text-dark font-roboto'>
            Students
          </span>
          <span className='text-md text-subtext font-roboto'>
            View student performances
          </span>
        </div>

        <div className='space-y-8 !my-12'>
          <div className='flex items-center justify-between'>
            <select
              // value={formState.instituteType}
              name='subject'
              // onChange={handleChange}
              required
              className='flex items-center px-2 sm:px-2.5 py-3.5 rounded-xl bg-transparent !border-[#D0D5DD] font-roboto font-normal w-[200px] h-full outline-none border-[1.5px] border-dark/20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext'
            >
              <option value='mathematics' className='h-full'>
                Mathematics
              </option>
              <option value='english' className='h-full'>
                English
              </option>
            </select>

            <SearchInput
              shape='rounded-lg'
              placeholder='Search'
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              initialData={data}
            />
          </div>
          <TableReuse data={searchResults} columns={columns} action={false} />
        </div>
      </div>
    </AdminsWrapper>
  );
};

export default withAuth("Admin", Students);
