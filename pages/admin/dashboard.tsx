import React, { useState } from "react";
import Img from "@/public/image/celebrate.png";
import Image from "next/image";
import ClassCard from "@/components/Molecules/Card/ClassCard";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import { ArrowBackIos } from "@mui/icons-material";
import UpdateDepartmentModal from "@/components/Molecules/Modal/UpdateDepartmentModal";
import AdminsWrapper from "@/components/Molecules/Layouts/Admin.Layout";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalAss, setOpenModalAss] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    department: "",
    description: "",
    duration: "",
    meetingLink: "",
    video: "",
  });

  const options = ["Option 1", "Option 2", "Option 3"];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };
  const handleModalAssignment = () => {
    setOpenModalAss(!openModalAss);
  };
  return (
    <>
      <UpdateDepartmentModal
        formState={formState}
        setFormState={setFormState}
        type='department'
        handleModalClose={handleModal}
        modalOpen={openModal}
      />
      <UpdateDepartmentModal
        formState={formState}
        setFormState={setFormState}
        type='assessment'
        handleModalClose={handleModalAssignment}
        modalOpen={openModalAss}
      />
      <AdminsWrapper
        isPublic={false}
        title='Dashboard'
        metaTitle='Olive Grove ~ Dashboard'
        // isPublic={false}
      >
        <div className='max-w-4xl mx-auto w-full grid gap-8 p-12 space-y-5'>
          <div className='max-w-md flex items-center justify-between bg-primary w-full rounded-3xl font-roboto relative'>
            <div className='flex flex-col px-9 py-11'>
              <h3 className='font-roboto font-medium text-[3.125rem] text-light leading-[3.75rem] mb-4'>
                Welcome back, John
              </h3>
              <span className='text-base text-light/80 font-roboto'>
                You have 3 classes and 2 assignments to attend to.
              </span>
              <span className='text-base text-light/80 font-roboto'>
                &quot;To teacher is to learn twice over&quot; learning to become
                the best!
              </span>
            </div>
            <div className='w-[200px] absolute right-0 bottom-0'>
              <Image
                src={Img}
                alt={`${Img} Pics`}
                className='w-full h-full object-scale-down'
              />
            </div>
          </div>
          <div className='flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 lg:py-7 border-2 w-full rounded-3xl font-roboto gap-4 sm:gap-5 md:gap-6'>
            {/* Title */}
            <span className='font-semibold text-xl sm:text-2xl text-dark'>
              Overview
            </span>
            {/* Section */}
            {/* <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0'> */}
            {/*<div className='flex flex-col w-full sm:w-auto'> */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
              <div className='flex flex-col items-center'>
                <h3 className='font-roboto font-medium text-sm sm:text-base text-secondary'>
                  Current Session
                </h3>
                <span className='text-dark font-semibold text-2xl sm:text-3xl'>
                  2022/2023
                </span>
              </div>

              <div className='flex flex-col w-full sm:w-auto items-center'>
                <h3 className='font-roboto font-medium text-sm sm:text-base text-secondary'>
                  Grade
                </h3>
                <div
                  className='flex items-center space-x-2 relative'
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className='text-dark font-semibold text-2xl sm:text-3xl'>
                    {selectedOption ?? "Class"}
                  </span>
                  <ArrowBackIos className='-rotate-90 -translate-y-[30%] text-xl sm:text-2xl' />
                  {isOpen && (
                    <div className='absolute top-10 left-0 sm:-left-8 z-50 w-full sm:min-w-[200px] h-fit py-4 px-4 rounded-md shadow-lg bg-white border flex flex-col space-y-4'>
                      {options.map((option) => (
                        <span
                          key={option}
                          className='block w-full py-2 px-2 font-roboto text-start cursor-pointer text-sm sm:text-base'
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-col w-full sm:w-auto'>
                <h3 className='text-sm sm:text-base font-roboto font-medium text-secondary'>
                  No. of Classes
                </h3>
                <span className='text-dark font-semibold text-2xl sm:text-3xl'>
                  8
                </span>
              </div>
            </div>
          </div>

          <div className='flex h-fit w-full gap-8 !mt-8'>
            <ClassCard handleEdit={handleModal} editable={true} title='class' />
            <ClassCard
              editable={true}
              title='assignment'
              handleEdit={handleModalAssignment}
            />
          </div>
        </div>
      </AdminsWrapper>
    </>
  );
};

export default withAuth("Admin", Dashboard);
