import React, { useState } from "react";
import Img from "@/public/image/celebrate.png";
import Image from "next/image";
import ClassCard from "@/components/Molecules/Card/ClassCard";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import { ArrowBackIos, ExpandMore } from "@mui/icons-material";
import UpdateDepartmentModal from "@/components/Molecules/Modal/UpdateDepartmentModal";

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

  const options = ["JS 1", "JS 2", "JS 3", "SS 1", "SS 2", "SS 3"];

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
      <TeachersWrapper title='Dashboard' metaTitle='Olive Groove ~ Dashboard'>
        <div className='space-y-5'>
          <div className='bg-primary w-full rounded-3xl font-roboto relative overflow-hidden max-h-[200px]'>
            <div className='flex flex-col px-4 sm:px-6 md:px-9 py-6 sm:py-8 md:py-11 w-full z-10'>
              <h3 className='font-roboto font-medium text-xl md:text-2xl lg:text-3xl lg:text-[3.125rem] text-light leading-tight sm:leading-snug md:leading-[3.75rem] mb-2 sm:mb-4'>
                Welcome back, John
              </h3>
              <span className='text-sm sm:text-base text-light/80 font-roboto'>
                You have 3 lectures and 2 assessments to attend to.
              </span>
              <span className='text-sm sm:text-base text-light/80 font-roboto mt-1'>
                &quot;To teacher is to learn twice over&quot; learning to become
                the best!
              </span>
            </div>
            <div className='w-[80px] sm:w-[130px] md:w-[160px] lg:w-[200px] absolute right-0 bottom-0'>
              <Image
                src={Img}
                alt={`${Img} Pics`}
                className='w-full h-full object-contain sm:object-scale-down'
                width={200}
                height={200}
              />
            </div>
          </div>
          <div className='flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 lg:py-7 border-2 w-full rounded-3xl font-roboto gap-4 sm:gap-5 md:gap-6'>
            {/* Title */}
            <span className='font-semibold text-xl sm:text-2xl text-dark'>
              Overview
            </span>
            {/* Section */}
            <div className='flex justify-evenly items-center'>
              <div className='flex flex-col justify-start text-start w-full'>
                <h3 className='font-roboto font-medium text-sm sm:text-base w-full text-secondary'>
                  Current Session
                </h3>
                <span className='text-dark font-semibold text-xl md:text-2xl'>
                  2022/2023
                </span>
              </div>

              <div className='flex flex-col w-full'>
                <h3 className='font-roboto font-medium text-sm sm:text-base text-secondary w-full'>
                  Grade
                </h3>
                <div
                  className='flex items-center space-x-2 relative'
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <div className='flex items-center justify-center space-x-2 cursor-pointer'>
                    <span className='text-dark font-semibold text-xl md:text-2xl'>
                      {selectedOption ?? "Class"}
                    </span>
                    <ArrowBackIos className='!text-lg md:!text-xl -rotate-90 -translate-y-[30%] mt-1' />
                  </div>
                  {isOpen && (
                    <div className='absolute top-8 -left-8 z-50 min-w-[200px] h-fit py-4 px-4 rounded-md shadow-lg bg-white border flex flex-col space-y-4'>
                      {options.map((option) => (
                        <span
                          key={option}
                          className='block w-full py-2 px-2 font-roboto text-start cursor-pointer'
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-col w-full items-center'>
                <h3 className='font-roboto font-medium text-sm sm:text-base text-secondary w-full'>
                  No. of Lectures
                </h3>
                <span className='text-dark font-semibold text-xl md:text-2xl w-full'>
                  8
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row w-full gap-2 md:gap-4 lg:gap-8 mt-4 sm:mt-6 md:mt-8'>
            <div className='w-full md:w-1/2'>
              <ClassCard
                handleEdit={handleModal}
                editable={true}
                title='class'
              />
            </div>
            <div className='w-full md:w-1/2 mt-4 sm:mt-0'>
              <ClassCard
                editable={true}
                title='assignment'
                handleEdit={handleModalAssignment}
              />
            </div>
          </div>
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Dashboard);
