import { useRouter } from "next/router";
import React, { useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import TableReuse from "@/components/Molecules/Table/TableReuse";
import Img from "@/public/image/student3.png";
import SearchInput from "@/components/Atoms/SearchInput";
import { ArrowBackIos } from "@mui/icons-material";

const data = [
  {
    id: 1,
    student: {
      name: "John Doe",
      profile: Img,
    },
    submissionDate: "12:00AM  November 14, 2023",
  },
  {
    id: 2,
    student: {
      name: "Jane Doe",
      profile: Img,
    },
    submissionDate: "05:30AM  December 22, 2023",
  },
  {
    id: 3,
    student: {
      name: "Smith Doe",
      profile: Img,
    },
    submissionDate: "10:45PM  April 11, 2024",
  },
];

const AssessmentDetailsPage = () => {
  const router = useRouter();
  const { assessmentId } = router.query;
  const [searchResults, setSearchResults] = useState(data);

  const columns = [
    { label: "Student", key: "student" },
    { label: "Date of Submission", key: "submissionDate" },
  ];

  return (
    <TeachersWrapper
      title={`Assessment`}
      metaTitle={`Olive Groove ~ ${assessmentId} assessment`}
    >
      <div className='p-12 space-y-5'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col'>
            <span className='text-lg font-medium text-dark font-roboto'>
              Access Assessments
            </span>
            <span className='text-md text-subtext font-roboto'>
              Manage, create and access assessments.
            </span>
          </div>
          <div className=''>
            <button
              className='flex items-center font-roboto font-medium text-primary text-base cursor-pointer'
              onClick={() => {
                router.back();
              }}
            >
              <ArrowBackIos className='text-primary !text-base' />
              Back
            </button>
          </div>
        </div>

        <div className='space-y-8 !my-12'>
          <div className='flex items-center justify-between'>
            <span className='text-lg text-subtext font-semibold font-roboto'>
              Further Mathematics Classwork Submissions
            </span>

            <SearchInput
              shape='rounded-lg'
              placeholder='Search'
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              initialData={data}
            />
          </div>
          <TableReuse data={searchResults} columns={columns} />
        </div>
      </div>
    </TeachersWrapper>
  );
};

export default withAuth("Teacher", AssessmentDetailsPage);
