import { TCourse, TTopicDetails } from '@/components/utils/types';
import { useRouter } from 'next/router';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';

interface TopicContextType {
  topicDetails: TTopicDetails;
  isLoading: boolean;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

/**
 * * Provider component for the TopicContext, which provides the current topic, chapter, lesson details and loading state to the child components
 */
export const TopicContextProvider: React.FC<{
  children: ReactNode;
  course: TCourse | undefined;
}> = ({ children, course }) => {
  const router = useRouter();
  const { topic } = router.query;
  const [topicDetails, setTopicDetails] = useState<TTopicDetails>({
    path: undefined,
    topic: undefined,
    type: 'section',
    topicChapter: '',
    topicLesson: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * * Function responsible for returning the details of the topic to be displayed
   */
  const getTopic = useCallback(() => {
    setIsLoading(true);

    let foundTopic = false;

    // * Loop through each chapter in the course
    for (const chapter of course?.chapters || []) {
      for (const lesson of chapter.lessons) {
        // * Search for the topic with the id passed in the query
        const section = lesson.sections.find(
          (section) => section._id === topic
        );

        if (lesson._id === topic) {
          foundTopic = true;
          setTopicDetails({
            path: [chapter.title, lesson.title, ''],
            topicChapter: chapter._id!,
            topicLesson: lesson._id!,
            type: 'lesson',
            topic: lesson,
          });
        }

        if (section) {
          foundTopic = true;
          setTopicDetails({
            path: [chapter.title, lesson.title, section?.title],
            topicChapter: chapter._id!,
            topicLesson: lesson._id!,
            type: 'section',
            topic: section,
          });
          break;
        }

        // * Check if a section has currentTutorial: true
        const sectionWithCurrentTutorial = lesson.sections.find(
          (section) => section.currentTutorial
        );

        if (sectionWithCurrentTutorial && !foundTopic) {
          foundTopic = true;
          setTopicDetails({
            path: [
              chapter.title,
              lesson.title,
              sectionWithCurrentTutorial.title,
            ],
            topicChapter: chapter._id!,
            topicLesson: lesson._id!,
            type: 'section',
            topic: sectionWithCurrentTutorial,
          });
          break;
        }
      }

      if (foundTopic) break;
    }

    // * Fallback: If no section matches the query or currentTutorial, set the first section
    if (!foundTopic) {
      for (const chapter of course?.chapters || []) {
        for (const lesson of chapter.lessons) {
          const firstSection = lesson.sections[0];
          if (firstSection) {
            setTopicDetails({
              path: [chapter.title, lesson.title, firstSection.title],
              topicChapter: chapter._id!,
              topicLesson: lesson._id!,
              type: 'section',
              topic: firstSection,
            });
            foundTopic = true;
            break;
          }
        }
        if (foundTopic) break;
      }
    }

    setIsLoading(false);
  }, [course?.chapters, topic]);

  useEffect(() => {
    getTopic();
  }, [router.asPath, course, getTopic]);

  return (
    <TopicContext.Provider value={{ topicDetails, isLoading }}>
      {children}
    </TopicContext.Provider>
  );
};

export const useTopicContext = (): TopicContextType => {
  const context = useContext(TopicContext);
  if (!context) {
    throw new Error(
      'useTopicContext must be used within a TopicContextProvider'
    );
  }
  return context;
};
