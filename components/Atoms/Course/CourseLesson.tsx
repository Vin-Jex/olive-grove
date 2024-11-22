import { TLesson } from "@/components/utils/types";
import { FC } from "react";
import { Topic } from "./CourseTopic";
import Wrapper from "./CourseWrapper";
import Add from "./CourseAddButton";

const Lesson: FC<{
  lesson: TLesson;
  chapterId: string;
}> = ({ lesson, chapterId }) => {
  return (
    <>
      <Wrapper
        type="section"
        title={lesson.title}
        existingDetails={lesson}
        sectionType="lesson"
        parentId={chapterId}
        sectionId={lesson._id!}
      >
        {lesson.sections.map((section) => (
          <>
            <Topic topic={section} lessonId={lesson._id || ""} />
          </>
        ))}
        <Add type="topic" parentId={lesson._id || ""} />
      </Wrapper>
    </>
  );
};

export default Lesson;
