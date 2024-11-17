import Cookies from "js-cookie";
import { TLesson } from "@/components/utils/types";
import { FC } from "react";
import { Topic } from "./CourseTopic";
import Wrapper from "./CourseWrapper";
import Add from "./CourseAddButton";

const Lesson: FC<{
  lesson: TLesson;
  chapterId: string;
}> = ({ lesson, chapterId }) => {
  const userRole = Cookies.get("role");
  return (
    <>
      <Wrapper
        type="section"
        title={lesson.title}
        existingDetails={lesson}
        sectionType="lesson"
        parentId={chapterId}
      >
        {lesson.sections.map((section) => (
          <>
            <Topic topic={section} lessonId={lesson._id || ""} />
          </>
        ))}
        {userRole === "Teacher" && (
          <Add type="topic" parentId={lesson._id || ""} />
        )}
      </Wrapper>
    </>
  );
};

export default Lesson;
