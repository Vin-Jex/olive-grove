import Hero from "@/components/Molecules/Hero";
import Layout from "@/components/Molecules/Layout";
import Image from "next/image";
import React, { useEffect } from "react";
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
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "@/contexts/AuthContext";

const Home: React.FC = () => {
  const router = useRouter();
  const { loggedIn, user } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
    });
  }, []);

  const staggerVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Layout title='Olive Grove School'>
      <div className='mx-auto scroll-smooth duration-500 transition-all relative'>
        {/* Hero Section */}
        <Hero />

        <div id='discover' data-aos='fade-in'>
          {/* Explore Section */}
          <motion.div
            variants={staggerVariants}
            initial='hidden'
            animate='show'
            className='flex flex-col lg:flex-row gap-y-12 md:gap-x-12 px-[1.5rem] sm:px-[2.5rem] md:px-[3rem] lg:px-[2rem] xl:px-[3rem] py-[3rem] sm:py-[4rem] md:py-[7rem] lg:items-center lg:justify-center'
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className='flex flex-col justify-center w-full gap-y-3 md:max-w-[670px] glass-card mx-auto'
            >
              <h5 className='text-primary text-base leading-6 font-semibold font-roboto'>
                Explore
              </h5>
              <motion.span className='flex text-dark text-[2rem] md:text-[2.4rem] xl:text-[3rem] lg:items-stretch leading-[50px] md:leading-[58px] lg:leading-[60px] xl:leading-[67px] font-bold font-roboto w-full'>
                Explore a Variety of Classes on Our Platform
              </motion.span>
              <span className='text-subtext text-base md:text-base lg:text-lg font-roboto leading-7'>
                At Olive Grove School, we offer a wide range of classes to cater
                to different interests and learning goals.
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
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className='flex items-center justify-items-end w-full sm:w-[95%] md:w-[90%] lg:min-w-[550px] lg:max-w-[600px] overflow-hidden mx-auto'
            >
              <Image
                src={student1}
                alt='olive_grove_featured_class'
                width='10000'
                height='10000'
                className='w-full h-full max-h-[600px] md:min-h-[600px] object-cover rounded-tl-[5rem] rounded-br-[5rem] rounded-xl'
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div
          id='features'
          data-aos='fade-up'
          className='flex flex-col items-center gap-20 px-[1.2rem] sm:px-[2.5rem] md:px-[3rem] lg:px-[2rem] xl:px-[3rem] py-[3rem] sm:py-[4rem] md:py-[7rem]'
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className='flex flex-col items-center justify-center text-center md:w-[800px] mx-auto gap-y-2'
          >
            <h5 className='text-primary text-base leading-6 font-semibold font-roboto'>
              Features
            </h5>
            <span className='flex text-dark text-[2rem] md:text-[2.4rem] xl:text-[3rem] lg:items-stretch leading-[50px] md:leading-[58px] lg:leading-[60px] xl:leading-[67px] font-bold font-roboto items-stretch md:w-[572px]'>
              Explore the Features of Our Platform
            </span>
            <span className='text-subtext text-base md:text-lg font-roboto leading-7'>
              Our platform offers a range of key features designed to enhance
              the learning experience.
            </span>
          </motion.div>

          <div className='flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-y-10 md:gap-x-12 w-[97%]'>
            {[
              {
                icon: write,
                title: "Student Portals",
                description:
                  "Access your personalized student portal for a tailored learning experience.",
              },
              {
                icon: teacher,
                title: "Teacher Portals",
                description:
                  "Teachers can easily manage and organize their classes through our intuitive teacher portals.",
              },
              {
                icon: file,
                title: "Submit Work",
                description:
                  "Access your personalized student portal for a tailored learning experience.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className='flex flex-col justify-center items-center gap-y-1 md:gap-y-3 xl:gap-y-5 flex-[1_0_0] text-center glass-card'
              >
                <Image
                  src={feature.icon}
                  alt={`${feature.title}_icon`}
                  width='100000'
                  height='100000'
                  className='w-[50px] h-[50px] md:w-[75px] md:h-[75px] object-cover'
                />

                <h6 className='text-dark text-[19px] sm:text-[20px] md:text-[25px] xl:text-[29px] 2xl:text-[32px] font-bold font-roboto capitalize leading-7'>
                  {feature.title}
                </h6>
                <span className='text-subtext text-base font-roboto sm:w-[405px]'>
                  {feature.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div id='about_us' data-aos='fade-up'>
          <div className='flex flex-col lg:flex-row w-full gap-y-12 gap-x-12 px-[1.2rem] py-[3rem] sm:py-[4rem] md:py-[7rem] items-center lg:justify-center'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className='flex items-center justify-items-end w-full sm:w-[95%] md:w-[90%] lg:min-w-[550px] lg:max-w-[600px] overflow-hidden order-2 lg:order-1 mx-auto'
            >
              <Image
                src={student2}
                alt='olive_grove_featured_class'
                width='10000'
                height='10000'
                className='w-full h-full max-h-[600px] md:min-h-[600px] object-cover rounded-tl-[5rem] rounded-br-[5rem] rounded-xl'
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className='flex flex-col lg:justify-center w-full gap-y-6 order-1 lg:order-2 lg:w-[700px] mx-auto'
            >
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
            </motion.div>
          </div>
          <div className='flex flex-col lg:flex-row w-full gap-y-12 gap-x-12 px-[1.2rem] sm:px-[2.5rem] md:px-[3rem] lg:px-[2rem] xl:px-[3rem] py-[3rem] sm:py-[4rem] md:py-[7rem] items-center justify-center'>
            <div className='flex flex-col justify-center w-full lg:w-[700px] gap-y-6 mx-auto'>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
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
                    const role = user?.role;
                    loggedIn
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
                  {loggedIn ? "Dashboard" : "Login"}
                </Button>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className='flex items-center justify-items-end w-full sm:w-[95%] md:w-[90%] lg:min-w-[550px] lg:max-w-[600px] overflow-hidden mx-auto'
            >
              <Image
                src={student3}
                alt='olive_grove_featured_class'
                width='10000'
                height='10000'
                className='w-full h-full max-h-[600px] md:min-h-[600px] object-cover rounded-tl-[5rem] rounded-br-[5rem] rounded-xl'
              />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
