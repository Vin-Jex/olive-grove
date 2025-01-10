import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React, { useEffect, useState } from "react";
import Img from "@/public/image/welcome_img.svg";
import disturbance1 from "@/public/image/disturbance1.png";
import disturbance2 from "@/public/image/disturbance2.png";
import disturbance3 from "@/public/image/disturbance3.png";
import disturbance4 from "@/public/image/disturbance4.png";
import disturbance5 from "@/public/image/disturbance5.png";
import Image from "next/image";
import ClassCard from "@/components/Molecules/Card/ClassCard";
import withAuth from "@/components/Molecules/WithAuth";
import { baseUrl } from "@/components/utils/baseURL";
import Calendar from "@/components/Molecules/Calendar";
import axiosInstance from "@/components/utils/axiosInstance";
import { TodayClass } from "@/data/data";
import DepartmentModal from "@/components/Molecules/Modal/DepartmentModal";
import { TUser } from "@/components/utils/types";
import { useUser } from "@/contexts/UserContext";
import toast from "react-hot-toast";

type TCourseInfo = { courseId: string; courseName: string };
type TAssessmentInfo = { assessmentId: string; title: string };
type TResponse = {
  data: {
    department: string;
    academicSection: string;
    enrolledCourses: TCourseInfo[];
    upcomingCourses: TCourseInfo[];
    upcomingAssessments: TAssessmentInfo[];
  };
};

type CardProps = {
  header: string;
  main: string;
  footer?: string;
};

function Card({ header, main, footer = "" }: CardProps) {
  return (
    <div className='flex flex-col justify-between text-start w-full  space-y-3 rounded-md shadow-card py-4 px-6'>
      <h3 className='font-roboto font-medium text-sm sm:text-base w-full text-secondary'>
        {header}
      </h3>
      <span className='text-dark font-semibold text-2xl md:text-3xl'>
        {main}
      </span>
      <span className='text-sm text-gray-400'>{footer}</span>
    </div>
  );
}

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalAss, setOpenModalAss] = useState(false);
  const [dashboardInfo, setDashboardInfo] = useState({
    department: "",
    accademicSession: "",
    enrolledCourses: [] as TCourseInfo[],
    upcomingCourses: [] as TCourseInfo[],
    upcomingAssessments: [] as TAssessmentInfo[],
  });
  const [studentDisplayInfoByDate, setStudentDisplayInfoByDate] = useState(
    new Date()
  );
  const { user, setUser } = useUser();

  useEffect(() => {
    async function fetchDashboardContent() {
      try {
        const response = await axiosInstance.get(
          `${baseUrl}/student/dashboard`
        );
        setDashboardInfo((prev) => ({
          ...prev,
          department: response.data.department,
          upcomingAssessments: response.data.upcomingAssessments,
          upcomingCourses: response.data.upcomingCourses,
        }));

        if (response.data.message) {
          toast.success(response.data.message);
        }
      } catch (err) {}
    }

    fetchDashboardContent();
  }, []);

  const handleModal = () => {
    setOpenModal(!openModal);
  };
  const handleModalAssignment = () => {
    setOpenModalAss(!openModalAss);
  };
  return (
    <>
      <DepartmentModal
        type='lecture'
        handleModalClose={handleModal}
        modalOpen={openModal}
      />
      <DepartmentModal
        type='assessment'
        handleModalClose={handleModalAssignment}
        modalOpen={openModalAss}
      />
      <StudentWrapper
        title='Dashboard'
        remark='See overview and summary of your studies.'
        metaTitle='Olive Grove - Track Your Academic Adventures'
        isPublic={false}
      >
        <div className='space-y-5 h-full mb-5'>
          <div className='max-sm:space-y-5 xl:grid xl:grid-cols-[3fr_1fr] xl:gap-4'>
            <div className='bg-primary max-sm:mt-4 max-sm:min-h-[170px] w-full rounded-3xl font-roboto relative overflow-hidden h-full'>
              <div className='flex flex-col h-full justify-center my-auto px-4 sm:px-6 md:px-9 py-6 sm:py-8 md:py-11 w-full z-10'>
                <h3 className='font-roboto font-medium text-xl md:text-2xl lg:text-3xl lg:text-[3.125rem] text-light leading-tight sm:leading-snug md:leading-[3.75rem] mb-2 sm:mb-4'>
                  Welcome back,{" "}
                  {user && "firstName" in user && "lastName" in user
                    ? `${user.firstName} ${user.lastName}`
                    : ""}
                </h3>
                <span className='text-base text-light/80 font-roboto'>
                  You have 3 classes and 2 assignments to attend to.
                </span>
                <span className='text-sm sm:text-base text-light/80 font-roboto mt-1'>
                  Continue learning to become the best!
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
              <Calendar
                setStudentInfoByDate={setStudentDisplayInfoByDate}
                startDate={new Date()}
              />
            </div>
          </div>

          {/* the content in this div should be displayed based on the date selected by the student */}
          <div className='grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-sm:gap-5 gap-10 '>
            <Card
              header='CGPA'
              main='3.42'
              footer='You are top 5 in the class, keep diong well'
            />
            <Card
              header='Grade'
              main='SSS 2'
              footer='Keep studying to progress to your next class.'
            />
            <Card
              header='No. of Courses'
              main={
                !dashboardInfo.enrolledCourses
                  ? "0"
                  : dashboardInfo.enrolledCourses.length.toString()
              }
              footer={
                // !dashboardInfo.enrolledCourses
                //   ? ''
                //   : dashboardInfo.enrolledCourses.join(' ,')
                ""
              }
            />
            <Card
              header='Current Session'
              main={dashboardInfo.accademicSession}
              footer='Next session starts in 3 months'
            />
          </div>
          {/* </div> */}
          {/* the content in this div should be displayed based on the date selected by the student */}

          <div className='flex flex-col sm:flex-row w-full max-sm:gap-5 gap-10 sm:gap-6 md:gap-8 mt-4 rounded-xl sm:mt-6 md:mt-8 '>
            <div className='w-full sm:w-1/2 shadow-card rounded-xl'>
              <ClassCard
                modalOpen={handleModal}
                data={TodayClass}
                title='class'
              />
            </div>
            <div className='w-full sm:w-1/2 mt-4 sm:mt-0 shadow-card rounded-xl'>
              <ClassCard modalOpen={handleModalAssignment} title='assignment' />
            </div>
          </div>
        </div>
      </StudentWrapper>
    </>
  );
};
// export default Dashboard;

export default withAuth("Student", Dashboard);
