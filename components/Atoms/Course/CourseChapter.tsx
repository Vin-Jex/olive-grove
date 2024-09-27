import { TChapter } from "@/components/utils/types";
import { FC } from "react";
import Add from "./CourseAddButton";
import Wrapper from "./CourseWrapper";
import Lesson from "./CourseLesson";

const Chapter: FC<{
  chapter: TChapter;
}> = ({ chapter }) => {
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
        <Add type="lesson" parentId={chapter._id || ""} />
      </Wrapper>
    </>
  );
};

export default Chapter;
