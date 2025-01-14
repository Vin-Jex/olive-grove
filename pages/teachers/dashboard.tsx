import React, { useState } from "react";
import Image from "next/image";
import Img from "@/public/image/welcome_img.svg";
import disturbance1 from "@/public/image/disturbance1.png";
import disturbance2 from "@/public/image/disturbance2.png";
import disturbance3 from "@/public/image/disturbance3.png";
import disturbance4 from "@/public/image/disturbance4.png";
import disturbance5 from "@/public/image/disturbance5.png";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import { KeyboardArrowDown } from "@mui/icons-material";
import UpdateDepartmentModal from "@/components/Molecules/Modal/UpdateDepartmentModal";
import Calendar from "@/components/Molecules/Calendar";
import ClassCard from "@/components/Molecules/Card/ClassCard";
import { useUser } from "@/contexts/UserContext";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalAss, setOpenModalAss] = useState(false);
  const [formState, setFormState] = useState({
    department: "",
    description: "",
    duration: "",
    meetingLink: "",
    video: "",
  });
  const [selectedOption, setSelectedOption] = useState<string>("");
    const { user } = useUser();
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const handleChange = (value: string) => {
    setSelectedOption(value);
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
      <TeachersWrapper
        title='Dashboard'
        metaTitle='Olive Grove - Inspire, Guide, and Educate'
        isPublic={false}
      >
        <div className='space-y-5 h-full mb-5'>
          <div className='max-sm:space-y-5 xl:grid xl:grid-cols-[3fr_1fr] xl:gap-4'>
            <div className='bg-primary max-sm:mt-4 max-sm:min-h-[170px] w-full rounded-3xl font-roboto relative overflow-hidden h-full'>
              <div className='flex flex-col h-full justify-center my-auto px-4 sm:px-6 md:px-9 py-6 sm:py-8 md:py-11 w-full z-10'>
                <h3 className='font-roboto font-medium text-xl md:text-2xl lg:text-3xl lg:text-[3.125rem] text-light leading-tight sm:leading-snug md:leading-[3.75rem] mb-2 sm:mb-4'>
                  Welcome back, {user && "name" in user ? user?.name : "Guest"}
                </h3>
                <span className='text-base text-light/80 font-roboto'>
                  You have 3 lectures and 2 assignments to attend to.
                </span>
                <span className='text-sm sm:text-base text-light/80 font-roboto mt-1'>
                  “To teach is to learn twice over.”{" "}
                  <strong>Joseph Joubert</strong>
                </span>
              </div>
              <div className='w-[130px] md:w-[160px] lg:w-[400px]  absolute right-0 bottom-0'>
                <Image
                  src={Img}
                  alt={`${Img} Pics`}
                  className='w-full h-full object-contain sm:object-scale-down'
                  width={400}
                  height={300}
                />
              </div>
              <Image
                src={disturbance1}
                alt={`${disturbance1} Pics`}
                className='absolute left-[25%] top-0 object-scale-down'
              />
              <Image
                src={disturbance5}
                alt={`${disturbance5} Pics`}
                className='absolute left-[55%] top-0 object-scale-down'
              />
              <Image
                src={disturbance2}
                alt={`${disturbance2} Pics`}
                className='absolute left-0 top-0 object-scale-down'
              />
              <Image
                src={disturbance3}
                alt={`${disturbance3} Pics`}
                className='absolute left-0 bottom-0 object-scale-down'
              />
              <Image
                src={disturbance4}
                alt={`${disturbance4} Pics`}
                className='absolute left-[35%] bottom-0 object-scale-down'
              />
            </div>
            <div className=' relative rounded-lg h-max'>
              <Calendar />
            </div>
          </div>

          <div className='flex items-center justify-center space-x-6 h-[10rem]'>
            <div className='flex flex-col justify-between w-full h-full space-y-3 rounded-xl shadow-card py-4 px-5'>
              <div className='flex items-center justify-between w-full'>
                <h3 className='font-roboto font-medium text-sm sm:text-base w-full text-secondary'>
                  Grade
                </h3>

                <div className='max-w-[5rem] w-full'>
                  <div className='relative w-full max-w-sm overflow-hidden border border-subtext/60 rounded-full shadow-sm px-2 py-0.5 bg-white flex items-center justify-between'>
                    <select
                      value={selectedOption}
                      onChange={(e) => handleChange(e.target.value)}
                      className='appearance-none w-full text-subtext/60 focus:outline-none outline-none text-sm'
                    >
                      <option value='' disabled>
                        All
                      </option>

                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <div className='absolute inset-y-0 right-0 flex items-center pointer-events-none bg-white !text-subtext/60'>
                      <KeyboardArrowDown className='!text-lg' />
                    </div>
                  </div>
                </div>
              </div>
              <span className='text-dark font-semibold text-2xl md:text-3xl'>
                SS2
              </span>
              <span className='text-sm text-gray-400'>
                Keep impacting these young ones with your knowledge.
              </span>
            </div>

            <div className='flex flex-col justify-between w-full h-full space-y-3 rounded-xl shadow-card py-4 px-5'>
              <h3 className='font-roboto font-medium text-sm sm:text-base w-full text-secondary'>
                No. of Courses
              </h3>
              <span className='text-dark font-semibold text-2xl md:text-3xl'>
                10
              </span>
              <span className='text-sm text-gray-400'>
                Mathematics, English
              </span>
            </div>

            <div className='flex flex-col justify-between w-full h-full space-y-3 rounded-xl shadow-card py-4 px-5'>
              <h3 className='font-roboto font-medium text-sm sm:text-base w-full text-secondary'>
                No. of Assessments
              </h3>
              <span className='text-dark font-semibold text-2xl md:text-3xl'>
                15
              </span>
              <span className='text-sm text-gray-400'>
                Your total assessments for this academic session
              </span>
            </div>

            <div className='flex flex-col justify-between w-full h-full space-y-3 rounded-xl shadow-card py-4 px-5'>
              <h3 className='font-roboto font-medium text-sm sm:text-base w-full text-secondary'>
                Current Session
              </h3>
              <span className='text-dark font-semibold text-2xl md:text-3xl'>
                2024/2025
              </span>
              <span className='text-sm text-gray-400'>
                Keep impacting these young ones with your knowledge.
              </span>
            </div>
          </div>

          <div className='flex flex-col md:flex-row w-full gap-2 md:gap-4 lg:gap-8 mt-4 sm:mt-6 md:mt-8'>
            <div className='w-full md:w-1/2 shadow-card rounded-2xl'>
              <ClassCard
                handleEdit={handleModal}
                editable={true}
                title='class'
              />
            </div>
            <div className='w-full md:w-1/2 mt-4 sm:mt-0 shadow-card rounded-2xl'>
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
