import { TChapter } from "@/components/utils/types";
import { FC } from "react";
import Add from "./CourseAddButton";
import Wrapper from "./CourseWrapper";
import Lesson from "./CourseLesson";
import { useAuth } from "@/contexts/AuthContext";

const Chapter: FC<{
  chapter: TChapter;
}> = ({ chapter }) => {
  const { user } = useAuth();

  return (
    <Wrapper
      type='section'
      title={chapter.title}
      existingDetails={chapter}
      sectionType='chapter'
      sectionId={chapter._id!}
    >
      {chapter.lessons.map((lesson, index) => (
        <Lesson key={index} lesson={lesson} chapterId={chapter._id || ""} />
      ))}
      {user?.role === "Teacher" && (
        <Add type='lesson' parentId={chapter._id || ""} />
      )}
    </Wrapper>
  );
};

export default Chapter;
