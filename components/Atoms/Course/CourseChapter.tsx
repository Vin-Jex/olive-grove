import { TChapter } from "@/components/utils/types";
import { FC } from "react";
import Cookies from "js-cookie";
import Add from "./CourseAddButton";
import Wrapper from "./CourseWrapper";
import Lesson from "./CourseLesson";

const Chapter: FC<{
  chapter: TChapter;
}> = ({ chapter }) => {
  const userRole = Cookies.get("role");
  return (
    <>
      <Wrapper
        type="section"
        title={chapter.title}
        existingDetails={chapter}
        sectionType="chapter"
      >
        {chapter.lessons.map((lesson) => (
          <>
            <Lesson lesson={lesson} chapterId={chapter._id || ""} />
          </>
        ))}
        {userRole === "Teacher" && (
          <Add type="lesson" parentId={chapter._id || ""} />
        )}
      </Wrapper>
    </>
  );
};

export default Chapter;
