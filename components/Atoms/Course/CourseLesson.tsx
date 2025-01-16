import { TLesson } from '@/components/utils/types';
import { FC, useCallback, useEffect, useState } from 'react';
import { Topic } from './CourseTopic';
import Wrapper from './CourseWrapper';
import Add from './CourseAddButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useTopicContext } from '@/contexts/TopicContext';

const Lesson: FC<{
  lesson: TLesson;
  chapterId: string;
}> = ({ lesson, chapterId }) => {
  const { user } = useAuth();
  const { topicDetails } = useTopicContext();
  const router = useRouter();

  const [hideChildren, setHideChildren] = useState(true);

  const isSubsectionActive = lesson.sections.some((ele) =>
    ele.subsections.map((ele) => ele._id).includes(router.query.topic as string)
  );

  const isActive =
    lesson._id === topicDetails?.topic?._id ||
    lesson.sections.some((ele) => ele._id === router.query.topic) ||
    isSubsectionActive;

  const toggleChildren = useCallback(() => {
    isSubsectionActive && setHideChildren(false);
  }, [isSubsectionActive]);

  useEffect(() => {
    toggleChildren();
  }, [toggleChildren]);
  console.log(lesson, 'current working lesson');
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
          <div key={section._id}>
            <Topic
              type='section'
              hideChildren={hideChildren}
              toggleChildren={setHideChildren}
              topic={section}
              lessonId={section._id || ''}
            />
            {!hideChildren &&
              section.subsections.length > 0 &&
              section.subsections.map((subsection) => (
                <div className='px-3 pl-5 text-sm' key={subsection._id}>
                  <Topic type='subsection' topic={subsection} lessonId={''} />
                </div>
              ))}
          </div>
        ))}
        {user?.role === 'Teacher' && (
          <Add type='topic' parentId={lesson._id || ''} />
        )}
      </Wrapper>
    </>
  );
};

export default Lesson;
