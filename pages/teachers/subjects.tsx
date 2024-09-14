import React, { FC, ReactNode, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import SearchInput from "@/components/Atoms/SearchInput";
import TableReuse from "@/components/Molecules/Table/TableReuse";
import Img from "@/public/image/student3.png";
import Button from "@/components/Atoms/Button";
import Select from "@/components/Atoms/Select";
import dummy_subject_img from "../../images/olive-groove-subject.png";
import { TSubject } from "@/components/utils/types";
import Image from "next/image";
import CreateClassModal from "@/components/Molecules/Modal/CreateClassModal";

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

const subjects: TSubject[] = [
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
  {
    image_url: dummy_subject_img.src,
    course_name: "AD Mathematics",
    lessons_no: 6,
  },
];

const Subject: FC<{ course: TSubject }> = ({ course }) => {
  return (
    <div className="flex rounded-xl overflow-hidden flex-col items-center w-full border border-[#1E1E1E33]">
      <div className="w-full h-[245px]">
        <Image
          src={course.image_url}
          width={266}
          height={245}
          className="w-full h-full object-cover"
          alt={course.course_name}
        />
      </div>

      <div className="p-3 flex flex-col gap-1 items-center w-full">
        <span className="font-bold text-lg">{course.course_name}</span>
        <span>{course.lessons_no} Lessons</span>
      </div>
    </div>
  );
};

const Students = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState(data);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState({
    class: "",
    description: "",
    duration: "",
    meetingLink: "",
    video: "",
  });

  return (
    <>
      <CreateClassModal
        formState={formState}
        setFormState={setFormState}
        type="class"
        handleModalClose={() => setOpenModalCreate((prev) => !prev)}
        modalOpen={openModalCreate}
      />

      <TeachersWrapper title="Subjects" metaTitle="Olive Groove ~ Subjects">
        <div className="p-12 space-y-5">
          {/* Title */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-lg font-medium text-dark font-roboto">
                Subjects
              </span>
              <span className="text-md text-subtext font-roboto">
                View and manage subjects
              </span>
            </div>
            <Button
              onClick={() => setOpenModalCreate((prev) => !prev)}
              width="fit"
              size="sm"
              color="outline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M15.0001 10.8317H10.8334V14.9984C10.8334 15.2194 10.7456 15.4313 10.5893 15.5876C10.4331 15.7439 10.2211 15.8317 10.0001 15.8317C9.77907 15.8317 9.56711 15.7439 9.41083 15.5876C9.25455 15.4313 9.16675 15.2194 9.16675 14.9984V10.8317H5.00008C4.77907 10.8317 4.56711 10.7439 4.41083 10.5876C4.25455 10.4313 4.16675 10.2194 4.16675 9.99837C4.16675 9.77736 4.25455 9.5654 4.41083 9.40912C4.56711 9.25284 4.77907 9.16504 5.00008 9.16504H9.16675V4.99837C9.16675 4.77736 9.25455 4.5654 9.41083 4.40912C9.56711 4.25284 9.77907 4.16504 10.0001 4.16504C10.2211 4.16504 10.4331 4.25284 10.5893 4.40912C10.7456 4.5654 10.8334 4.77736 10.8334 4.99837V9.16504H15.0001C15.2211 9.16504 15.4331 9.25284 15.5893 9.40912C15.7456 9.5654 15.8334 9.77736 15.8334 9.99837C15.8334 10.2194 15.7456 10.4313 15.5893 10.5876C15.4331 10.7439 15.2211 10.8317 15.0001 10.8317Z"
                  fill="#32A8C4"
                />
              </svg>
              <span>Create new subject</span>
            </Button>
          </div>

          <div className="space-y-8 !my-12">
            <div className="flex items-start justify-start gap-4 flex-col xl:justify-between xl:flex-row xl:gap-0 xl:items-center">
              <div className="flex justify-start items-center gap-4">
                <Select
                  options={["jss 1", "jss 2", "jss 3", "ss 1", "ss 2", "ss 3"]}
                  name="class"
                  required
                />
                <Select
                  options={["physics", "further mathematics"]}
                  name="subject"
                  required
                />
              </div>

              <SearchInput
                shape="rounded-lg"
                placeholder="Search for Subjects"
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                initialData={data}
              />
            </div>
            {/* <TableReuse data={searchResults} columns={columns} action={false} /> */}
            <div className="grid xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {subjects.map((course, i) => (
                <>
                  <Subject course={course} key={i} />
                </>
              ))}
            </div>
          </div>
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Students);
