import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React, { useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import SwitchContentNav from "@/components/Molecules/Navs/SwitchContentNav";
import TeacherCard from "@/components/Molecules/Card/TeacherSubjectCard";
import Button from "@/components/Atoms/Button";
import DepartmentModal from "@/components/Molecules/Modal/DepartmentModal";
import { TCourse } from "@/components/utils/types";
import UpdateDepartmentModal from "@/components/Molecules/Modal/UpdateDepartmentModal";

interface SubjectData {
  [key: string]: {
    subject: TCourse;
    role: string;
    time: string;
    topic: string;
    name: string;
    btnLink1: string;
    isActive: "Active" | "Inactive";
  }[];
}

export const subjectData: SubjectData = {
  week1: [
    {
      subject: { title: "Maths" },
      role: "Teacher",
      time: "09-10-2024T10:30:43",
      topic: "Calculus",
      name: "Dr. Ayodeji Emmanuel",
      btnLink1: "#",
      isActive: "Active",
    },
    {
      subject: { title: "English" },
      role: "Teacher",
      time: "09:00AM - 10:30AM",
      topic: "Organic Chemistry",
      name: "Dr. Ayodeji Emmanuel",
      btnLink1: "#",
      isActive: "Active",
    },
    {
      subject: { title: "Chemistry" },
      role: "Teacher",
      time: "09:00AM - 10:30AM",
      topic: "Organic Chemistry",
      name: "Dr. Ayodeji Emmanuel",
      btnLink1: "#",
      isActive: "Inactive",
    },
  ],
};

const Departments = () => {
  const [activeItem, setActiveItem] = useState("all courses");
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState({
    department: "",
    description: "",
    duration: "",
    meetingLink: "",
    video: "",
  });

  const handleModalEdit = () => {
    setOpenModalEdit(!openModalEdit);
  };
  const handleModalCreate = () => {
    setOpenModalCreate(!openModalCreate);
  };

  return (
    <>
      <UpdateDepartmentModal
        formState={formState}
        setFormState={setFormState}
        type='department'
        handleModalClose={handleModalEdit}
        modalOpen={openModalEdit}
      />
      <DepartmentModal
        type='lecture'
        handleModalClose={handleModalCreate}
        modalOpen={openModalCreate}
      />
      <StudentWrapper
        title='Departments'
        metaTitle='Olive Groove ~ Departments'
      >
        <div className='p-12 space-y-5'>
          {/* Title */}
          <div className='flex items-center justify-between'>
            <div className='flex flex-col'>
              <span className='text-lg font-medium text-dark font-roboto'>
                Explore your departments
              </span>
              <span className='text-md text-subtext font-roboto'>
                Manage, edit and create Departments.
              </span>
            </div>
            <Button size='md' width='fit' onClick={handleModalCreate}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M15.0001 10.8317H10.8334V14.9984C10.8334 15.2194 10.7456 15.4313 10.5893 15.5876C10.4331 15.7439 10.2211 15.8317 10.0001 15.8317C9.77907 15.8317 9.56711 15.7439 9.41083 15.5876C9.25455 15.4313 9.16675 15.2194 9.16675 14.9984V10.8317H5.00008C4.77907 10.8317 4.56711 10.7439 4.41083 10.5876C4.25455 10.4313 4.16675 10.2194 4.16675 9.99837C4.16675 9.77736 4.25455 9.5654 4.41083 9.40912C4.56711 9.25284 4.77907 9.16504 5.00008 9.16504H9.16675V4.99837C9.16675 4.77736 9.25455 4.5654 9.41083 4.40912C9.56711 4.25284 9.77907 4.16504 10.0001 4.16504C10.2211 4.16504 10.4331 4.25284 10.5893 4.40912C10.7456 4.5654 10.8334 4.77736 10.8334 4.99837V9.16504H15.0001C15.2211 9.16504 15.4331 9.25284 15.5893 9.40912C15.7456 9.5654 15.8334 9.77736 15.8334 9.99837C15.8334 10.2194 15.7456 10.4313 15.5893 10.5876C15.4331 10.7439 15.2211 10.8317 15.0001 10.8317Z'
                  fill='#FDFDFD'
                />
              </svg>
              <span className=''>Create Department</span>
            </Button>
          </div>

          <SwitchContentNav
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            navLink={["all courses", "active courses"]}
          />

          <>
            {activeItem === "all courses"
              ? Object.keys(subjectData).map((week, index) => (
                  <div key={index} className='!my-8'>
                    <span className='text-dark text-xl font-medium capitalize'>
                      {week}
                    </span>
                    <div className='grid grid-cols-3 gap-8 mt-4'>
                      {subjectData[week].map((subject, index) => (
                        <TeacherCard
                          academicWeekDate={1}
                          type='lecture'
                          key={index}
                          // name={subject.name}
                          // role={subject.isActive ? "Active" : "Inactive"}
                          time={new Date(subject.time).toLocaleString()}
                          // description={subject.subject}
                          subject={(subject.subject as TCourse).title}
                          btnLink1={() => {}}
                          btnLink2={handleModalEdit}
                        />
                      ))}
                    </div>
                  </div>
                ))
              : Object.keys(subjectData).map((week, index) => (
                  <div key={index} className='grid grid-cols-3 gap-8 !my-14'>
                    {subjectData[week].map((subject, index) => (
                      <TeacherCard
                        key={index}
                        academicWeekDate={1}
                        type='lecture'
                        // name={subject.name}
                        // role={subject.isActive ? "Active" : "Inactive"}
                        time={new Date(subject.time).toLocaleString()}
                        // description={subject.topic}
                        subject={(subject.subject as TCourse).title}
                        btnLink1={() => {}}
                        btnLink2={handleModalEdit}
                      />
                    ))}
                  </div>
                ))}
          </>
        </div>
      </StudentWrapper>
    </>
  );
};

export default withAuth("Teacher", Departments);
