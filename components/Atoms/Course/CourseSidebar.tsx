import { useCourseContext } from "@/contexts/CourseContext";
import Chapter from "./CourseChapter";
import Cookies from "js-cookie";
import { FC } from "react";
import Add from "./CourseAddButton";

const SideBar: FC<{
  courseId: string;
}> = ({ courseId }) => {
  const {
    course: { data: course },
  } = useCourseContext();

  const userRole = Cookies.get("role");

  return (
    <div className="gap-4 flex w-80 flex-col max-h-[80vh] overflow-y-auto rounded-sm px-2 ">
      {course?.chapters.map((chapter) => (
        <>
          <Chapter chapter={chapter} key={chapter._id} />
        </>
      ))}
      {userRole === "Teacher" && <Add type="chapter" parentId={courseId} />}
    </div>
  );
};

export default SideBar;
