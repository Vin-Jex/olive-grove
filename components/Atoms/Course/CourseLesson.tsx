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
          //* IMPLEMENT THE SUBSECTION DISPLAY(Can't be viewed now as no lecture has subsection yet.)
          <>
            <Topic topic={section} lessonId={lesson._id || ""} />
            {section.subsections &&
              section.subsections.map((subsection) => {
                <div className="p-3">
                  <Topic topic={subsection} lessonId={lesson._id || ""} />;
                </div>;
              })}
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
