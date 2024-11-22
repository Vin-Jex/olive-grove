import { TCourse, TSection, TTopicDetails } from "@/components/utils/types";
import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";

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
    type: "section",
    topicChapter: "",
    topicLesson: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * * Function responsible for returning the details of the topic to be displayed
   */
  const getTopic = useCallback(() => {
    setIsLoading(true);

    // * Loop through each chapter in the course
    for (const chapter of course?.chapters || []) {
      // * Loop through each lesson in each chapter
      for (const lesson of chapter.lessons) {
        // * Search for the topic with the id passed in the query in the list of topics under the current lesson
        const section = lesson.sections.find(
          (section) => section._id === topic
        );

        // * If the topic was found, update the topic details state and break the loop
        if (section) {
          console.log("TOPIC", section);
          setTopicDetails({
            path: [chapter.title, lesson.title, section?.title],
            topicChapter: chapter._id!,
            topicLesson: lesson._id!,
            type: "section",
            topic: section,
          });
          break;
        }
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
      "useTopicContext must be used within a TopicContextProvider"
    );
  }
  return context;
};
