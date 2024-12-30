import { Variants, motion } from "framer";
import { FC } from "react";
import SideBar from "./CourseSidebar";

const MobileSideBar: FC<{ courseId: string }> = ({ courseId }) => {
  const variants: Variants = {
    start: {
      x: -1000,
    },
    finish: {
      x: 0,
    },
  };

  return (
    <motion.div
      className='flex-none xl:hidden block absolute z-50 p-4 box-content bg-white w-max h-full top-0 left-0'
      initial='start'
      animate='finish'
      exit='start'
      variants={variants}
      transition={{ type: "tween" }}
    >
      <SideBar courseId={courseId} />
    </motion.div>
  );
};
  
export default MobileSideBar