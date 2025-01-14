import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import Img1 from "@/public/image/building1.jpeg";
import Button from "../Atoms/Button";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

// Sample image array
const images = [Img1];

export default function Hero() {
  const router = useRouter();
  const { user } = useAuth();

  // Framer Motion Variants for text animations
  const textContainer = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className='bg-blue-100 relative w-full'>
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect={"fade"}
        // loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={false}
        modules={[Autoplay, EffectFade]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt='backgroundImage'
              width='100000'
              height='100000'
              priority
              className='h-screen w-full object-cover -z-20 absolute top-0'
            />

            {/* Content Container with Framer Motion for Animations */}
            <div
              className={`flex flex-col justify-center h-screen z-10 p-3 sm:p-6 md:p-8 xl:p-16 gap-12 bg-[0%_500%] bg-gradient-to-r from-dark via-[#131313]/30 to-black`}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              {/* Text content animation */}
              <motion.div
                variants={textContainer}
                initial='hidden'
                animate='visible'
                className='w-full sm:w-[450px] md:w-[607px] flex flex-col space-y-2 md:space-y-5'
              >
                {/* Heading Animation */}
                <motion.span
                  variants={fadeInUp}
                  className='font-bold font-roboto text-[2.6rem] sm:text-[3rem] lg:text-[3.4rem] text-light items-stretch leading-[58px] sm:leading-[67px]'
                >
                  Discover a World of Knowledge at Olive Grove School
                </motion.span>

                {/* Subtext Animation */}
                <motion.p
                  variants={fadeInUp}
                  className='text-[16px] sm:text-[18px] lg:text-[18px] text-white/80 font-normal font-roboto leading-7'
                >
                  Welcome to Olive Grove School&apos;s online platform, where
                  learning meets convenience. Explore a wide range of classes,
                  connect with passionate teachers, and submit your work with
                  ease.
                </motion.p>

                {/* Button Animation */}
                <motion.div
                  variants={fadeInUp}
                  className='flex gap-x-4 md:gap-x-8 !mt-10'
                >
                  <Button
                    size='sm'
                    color='blue'
                    onClick={() => {
                      const role = user?.role;
                      router.push(
                        role === "Student"
                          ? "/students/dashboard"
                          : role === "Teacher"
                          ? "/teachers/dashboard"
                          : role === "Admin"
                          ? "/admin/dashboard"
                          : "/auth/path"
                      );
                    }}
                  >
                    Dashboard
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
