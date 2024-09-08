import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React, { useState } from "react";
import Img from "@/public/image/celebrate.png";
import Image from "next/image";
import ClassCard from "@/components/Molecules/Card/ClassCard";
import withAuth from "@/components/Molecules/WithAuth";
import ClassModal from "@/components/Molecules/Modal/ClassModal";
import { useRouter } from "next/router";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import { ArrowBackIos, ExpandMore } from "@mui/icons-material";
import EditClassModal from "@/components/Molecules/Modal/EditClassModal";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalAss, setOpenModalAss] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    class: "",
    description: "",
    duration: "",
    meetingLink: "",
    video: "",
  });

  const options = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    // You can perform any action here with the selected option
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };
  const handleModalAssignment = () => {
    setOpenModalAss(!openModalAss);
  };
  return (
    <>
      <EditClassModal
        formState={formState}
        setFormState={setFormState}
        type='class'
        handleModalClose={handleModal}
        modalOpen={openModal}
      />
      <EditClassModal
        formState={formState}
        setFormState={setFormState}
        type='assignment'
        handleModalClose={handleModalAssignment}
        modalOpen={openModalAss}
      />
      <TeachersWrapper title='Dashboard' metaTitle='Olive Groove ~ Dashboard'>
        <div className='p-12 space-y-5'>
          <div className='flex items-center justify-between bg-primary w-full rounded-3xl font-roboto relative'>
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
          <div className='flex flex-col px-10 py-7 border-2 w-full rounded-3xl font-roboto gap-6'>
            {/* Title */}
            <span className='font-semibold text-2xl text-dark'>Overview</span>
            {/* Section */}
            <div className='flex justify-evenly items-center'>
              <div className='flex flex-col w-full'>
                <h3 className='font-roboto font-medium text-base text-secondary'>
                  Current Session
                </h3>
                <span className='text-dark font-semibold text-3xl'>
                  2022/2023
                </span>
              </div>

              <div className='flex flex-col w-full'>
                <h3 className='font-roboto font-medium text-base text-secondary'>
                  Grade
                </h3>
                <div
                  className='flex items-center space-x-2 relative'
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className='text-dark font-semibold text-3xl'>
                    {selectedOption ?? "Class"}
                  </span>
                  <ArrowBackIos className='-rotate-90 -translate-y-[30%]' />
                  {isOpen && (
                    <div className='absolute top-10 -left-8 z-50 min-w-[200px] h-fit py-4 px-4 rounded-md shadow-lg bg-white border flex flex-col space-y-4'>
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

              <div className='flex flex-col w-full'>
                <h3 className='font-roboto font-medium text-base text-secondary'>
                  No. of Classes
                </h3>
                <span className='text-dark font-semibold text-3xl'>8</span>
              </div>
            </div>
          </div>

          <div className='flex h-fit w-full gap-8 !mt-8'>
            <ClassCard
              handleEdit={handleModal}
              editable={true}
              title="Today's Class"
            />
            <ClassCard
              editable={true}
              title='Assignments'
              handleEdit={handleModalAssignment}
            />
          </div>
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Dashboard);
