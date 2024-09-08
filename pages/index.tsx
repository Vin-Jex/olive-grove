import Hero from "@/components/Molecules/Hero";
import Layout from "@/components/Molecules/Layout";
import Image from "next/image";
import React from "react";
import study from "@/public/image/study.png";
import like from "@/public/image/like.png";
import student1 from "@/public/image/student2.png";
import student2 from "@/public/image/student5.png";
import student3 from "@/public/image/student7.png";
import write from "@/public/image/write.png";
import teacher from "@/public/image/teacher.png";
import file from "@/public/image/file.png";
import favorites from "@/public/image/favorites.png";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <Layout title='Olive Grove School'>
      <div className='mx-auto scroll-smooth duration-500 transition-all relative'>
        <div id='discover' className=''>
          <Hero />
          <div className='flex flex-col lg:flex-row gap-y-12 md:gap-x-12 px-[1.5rem] sm:px-[2.5rem] md:px-[3rem] lg:px-[2rem] xl:px-[3rem] py-[3rem] sm:py-[4rem] md:py-[7rem] lg:items-center lg:justify-center'>
            <div className='flex flex-col justify-center w-full gap-y-3 md:max-w-[670px]'>
              <h5 className='text-subtext text-base leading-6 font-semibold font-roboto'>
                Explore
              </h5>
              <span className='flex text-dark text-[2rem] md:text-[2.4rem] xl:text-[3rem] lg:items-stretch leading-[50px] md:leading-[58px] lg:leading-[60px]: xl:leading-[67px] font-bold font-roboto w-full'>
                Explore a Variety of Classes on Our Platform
              </span>
              <span className='text-subtext text-base md:text-base lg:text-lg font-roboto leading-7'>
                At Olive Grove School, we offer a wide range of classes to cater
                to different interests and learning goals. Whether you&apos;re
                looking to enhance your skills, pursue a new hobby, or gain
                knowledge in a specific field, our platform has something for
                everyone.
              </span>
              <div className='flex flex-col xl:flex-row self-stretch items-start gap-y-12 gap-x-8 w-full py-2 mt-6'>
                <div className='flex flex-col justify-center gap-y-2'>
                  <Image
                    src={study}
                    alt='featured_class'
                    className='w-8 h-8 md:w-10 md:h-10 object-cover'
                  />
                  <h6 className='text-dark text-lg md:text-xl font-bold font-roboto capitalize leading-7'>
                    Featured Classes
                  </h6>
                  <span className='text-subtext text-base font-roboto lg:w-[286px]'>
                    Unlock your potential with our diverse selection of classes
                    taught by industry experts.
                  </span>
                </div>
                <div className='flex flex-col justify-center gap-y-2'>
                  <Image
                    src={like}
                    alt='enriching_experiences'
                    className='w-8 h-8 md:w-10 md:h-10 object-cover'
                  />
                  <h6 className='text-dark text-lg md:text-xl font-bold font-roboto capitalize leading-7'>
                    Enriching Experiences
                  </h6>
                  <span className='text-subtext text-base font-roboto lg:w-[286px]'>
                    Immerse yourself in our engaging classes and discover new
                    passions and skills.
                  </span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-items-end w-full sm:w-[95%] md:w-[75%] lg:min-w-[600px] lg:max-w-[700px] overflow-hidden'>
              <Image
                src={student1}
                alt='olive_grove_featured_class'
                width='10000'
                height='10000'
                className='w-full h-full max-h-[650px] md:min-h-[690px] object-cover rounded-tl-[5rem] rounded-br-[5rem] sm:rounded-tl-[8rem] sm:rounded-br-[8rem] md:rounded-tl-[10rem] md:rounded-br-[10rem] rounded-[2rem] ml-auto overflow-hidden'
              />
            </div>
          </div>
        </div>

        {/* SECTION - FEATURED */}
        <div
          id='features'
          className='flex flex-col items-center gap-20 px-[1.2rem] sm:px-[2.5rem] md:px-[3rem] lg:px-[2rem] xl:px-[3rem] py-[3rem] sm:py-[4rem] md:py-[7rem]'
        >
          <div className='flex flex-col items-center justify-center text-center md:w-[800px] mx-auto gap-y-2'>
            <h5 className='text-subtext text-base leading-6 font-semibold font-roboto'>
              Features
            </h5>
            <span className='flex text-dark text-[2rem] md:text-[2.4rem] xl:text-[3rem] lg:items-stretch leading-[50px] md:leading-[58px] lg:leading-[60px]: xl:leading-[67px] font-bold font-roboto items-stretch md:w-[572px]'>
              Explore the Features of Our Platform
            </span>
            <span className='text-subtext text-base md:text-lg font-roboto leading-7'>
              Our platform offers a range of key features designed to enhance
              the learning experience. With individual student and teacher
              portals, as well as the ability for students to submit work
              individually, Olive Grove School provides a comprehensive and
              user-friendly online learning environment.
            </span>
          </div>

          <div className='flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-y-10 md:gap-x-12 w-[97%]'>
            <div className='flex flex-col justify-center items-center gap-y-1 md:gap-y-3 xl:gap-y-5 flex-[1_0_0] text-center'>
              <Image
                src={write}
                alt='write_icon'
                width='100000'
                height='100000'
                className='w-[50px] h-[50px] md:w-[75px] md:h-[75px] object-cover'
              />
              <h6 className='text-dark text-[19px] sm:text-[20px] md:text-[25px] xl:text-[29px] 2xl:text-[32px] font-bold font-roboto capitalize leading-7'>
                Enriching Experiences
              </h6>
              <span className='text-subtext text-base font-roboto sm:w-[405px]'>
                Access your personalized student portal for a tailored learning
                experience.
              </span>
            </div>
            <div className='flex flex-col justify-center items-center gap-y-1 md:gap-y-3 xl:gap-y-5 flex-[1_0_0] text-center'>
              <Image
                src={teacher}
                alt='teacher_icon'
                width='100000'
                height='100000'
                className='w-[50px] h-[50px] md:w-[75px] md:h-[75px] object-cover'
              />
              <h6 className='text-dark text-[19px] sm:text-[20px] md:text-[25px] xl:text-[29px] 2xl:text-[32px] font-bold font-roboto capitalize leading-7'>
                Teacher Portals
              </h6>
              <span className='text-subtext text-base font-roboto sm:w-[405px]'>
                Teachers can easily manage and organize their classes through
                our intuitive teacher portals.
              </span>
            </div>
            <div className='flex flex-col justify-center items-center gap-y-1 md:gap-y-3 xl:gap-y-5 flex-[1_0_0] text-center'>
              <Image
                src={file}
                alt='file_icon'
                width='100000'
                height='100000'
                className='w-[50px] h-[50px] md:w-[75px] md:h-[75px] object-cover'
              />
              <h6 className='text-dark text-[19px] sm:text-[20px] md:text-[25px] xl:text-[29px] 2xl:text-[32px] font-bold font-roboto capitalize leading-7'>
                Submit Work Individually
              </h6>
              <span className='text-subtext text-base font-roboto sm:w-[405px]'>
                Students have the convenience of submitting their work directly
                through our platform.
              </span>
            </div>
          </div>
        </div>
        <div id='about_us' className=''>
          <div className='flex flex-col lg:flex-row w-full gap-y-12 gap-x-12 px-[1.2rem] py-[3rem] sm:py-[4rem] md:py-[7rem] items-center lg:justify-center'>
            <div className='flex items-center justify-items-end w-full sm:w-[95%] md:w-[70%] lg:w-[75%] lg:min-w-[600px] lg:max-w-[670px] overflow-hidden order-2 lg:order-1'>
              <Image
                src={student2}
                alt='olive_grove_featured_class'
                width='10000'
                height='10000'
                className='w-full h-full max-h-[650px] md:min-h-[700px] object-cover rounded-tl-[5rem] rounded-br-[5rem] sm:rounded-tl-[8rem] sm:rounded-br-[8rem] md:rounded-tl-[10rem] md:rounded-br-[10rem] rounded-[2rem] mr-auto'
              />
            </div>
            <div className='flex flex-col lg:justify-center w-full gap-y-6 order-1 lg:order-2 lg:w-[700px]'>
              <span className='flex text-dark text-[1.6rem] sm:text-[1.8rem] md:text-[2.4rem] xl:text-[3rem] lg:items-stretch leading-[38px] sm:leading-[48px] md:leading-[58px] lg:leading-[60px] xl:leading-[67px] font-bold font-roboto items-stretch text-center lg:text-start'>
                Experience the flexibility and accessibility of our platform for
                personalized learning.
              </span>
              <span className='text-subtext text-base md:text-lg font-roboto leading-7 text-center lg:text-start'>
                Our platform offers a wide range of courses, allowing students
                to learn at their own pace and on their own schedule. With
                interactive lessons and personalized feedback, students can
                maximize their learning potential.
              </span>
            </div>
          </div>
          <div className='flex flex-col lg:flex-row w-full gap-y-12 gap-x-12 px-[1.2rem] sm:px-[2.5rem] md:px-[3rem] lg:px-[2rem] xl:px-[3rem] py-[3rem] sm:py-[4rem] md:py-[7rem] items-center justify-center'>
            <div className='flex flex-col justify-center w-full lg:w-[700px] gap-y-6'>
              <Image
                src={favorites}
                alt='favorites_icon'
                width='10000'
                height='10000'
                className='w-[50px] h-[50px] md:w-[75px] md:h-[75px] object-cover'
              />
              <span className='flex text-dark text-[1.6rem] sm:text-[1.8rem] md:text-[2.4rem] xl:text-[3rem] lg:items-stretch leading-[38px] sm:leading-[48px] md:leading-[58px] lg:leading-[60px]: xl:leading-[67px] font-bold font-roboto items-stretch text-start'>
                Providing Quality Online Education for Students
              </span>
              <span className='text-subtext text-base md:text-lg font-roboto leading-7'>
                Welcome to Olive Grove School, where we are committed to
                delivering high-quality online education to our students. Our
                mission is to provide a comprehensive learning experience that
                prepares students for success in the modern world.
              </span>
              <Button
                width='fit'
                color='outline'
                size='lg'
                onClick={() => {
                  const role = Cookies.get("role");
                  Cookies.get("jwt")
                    ? router.push(
                        role === "Student"
                          ? "/students/dashboard"
                          : role === "Teacher"
                          ? "/teachers/dashboard"
                          : role === "Admin"
                          ? "/admins/dashboard"
                          : "/auth/path"
                      )
                    : router.push("/auth/path");
                }}
              >
                {Cookies.get("jwt") ? "Dashboard" : "Login"}
              </Button>
            </div>

            <div className='flex items-center justify-items-end w-full sm:w-[95%] md:w-[70%] lg:w-[75%] lg:min-w-[600px] lg:max-w-[700px] overflow-hidden'>
              <Image
                src={student3}
                alt='olive_grove_featured_class'
                width='10000'
                height='10000'
                className='w-full h-full max-h-[650px] md:min-h-[690px] object-cover rounded-tl-[5rem] rounded-br-[5rem] sm:rounded-tl-[8rem] sm:rounded-br-[8rem] md:rounded-tl-[10rem] md:rounded-br-[10rem] rounded-[2rem]'
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
