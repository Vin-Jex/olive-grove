import { TLesson } from '@/components/utils/types';
import { FC } from 'react';
import { Topic } from './CourseTopic';
import Wrapper from './CourseWrapper';
import Add from './CourseAddButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

const Lesson: FC<{
  lesson: TLesson;
  chapterId: string;
}> = ({ lesson, chapterId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const isActive =
    lesson.sections.some((ele) => ele._id === router.query.topic) ||
    lesson.sections.some((ele) =>
      ele.subsections
        .map((ele) => ele._id)
        .includes(router.query.topic as string)
    );
  return (
    <>
      <Wrapper
        type='section'
        title={lesson.title}
        existingDetails={lesson}
        isCurrentLesson={isActive}
        sectionType='lesson'
        parentId={chapterId}
        sectionId={lesson._id!}
      >
        {lesson.sections.map((section) => (
          //* IMPLEMENT THE SUBSECTION DISPLAY(Can't be viewed now as no lecture has subsection yet.)
          <>
            <Topic type='section' topic={section} lessonId={lesson._id || ''} />
            {section.subsections &&
              section.subsections.map((subsection) => {
                <div className='px-3 text-sm'>
                  <Topic type='subsection' topic={subsection} lessonId={lesson._id || ''} />;
                </div>;
              })}
          </>
        ))}
        {user?.role === 'Teacher' && (
          <Add type='topic' parentId={lesson._id || ''} />
        )}
      </Wrapper>
    </>
  );
};

export default Lesson;
