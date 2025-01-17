import {
  TCourse,
  TFetchState,
  TCourseModalFormData,
} from '@/components/utils/types';
import {
  createContext,
  FC,
  ReactNode,
  Reducer,
  useContext,
  useReducer,
  useState,
} from 'react';

type TCourseReducerAction =
  | 'FETCHING_COURSE'
  | 'ERROR_FETCHING_COURSE'
  | 'ADD_COURSE'
  | 'EDIT_COURSE'
  | 'CREATE_CHAPTER'
  | 'CREATE_LESSON'
  | 'CREATE_SUBSECTION'
  | 'CREATE_TOPIC'
  | 'EDIT_CHAPTER'
  | 'EDIT_LESSON'
  | 'EDIT_TOPIC'
  | "EDIT_SUBSECTION"
  | 'DELETE_CHAPTER'
  | 'DELETE_LESSON'
  | 'DELETE_SUBSECTION'
  | 'DELETE_TOPIC';

type TModalMetadata = {
  type: 'course' | 'chapter' | 'lesson' | 'topic' | 'subsection' | undefined;
  mode: 'create' | 'edit' | 'delete' | undefined;
  handleAction?: (
    formData: TCourseModalFormData
  ) => Promise<boolean> | undefined;
  handleDelete?: (
    formData?: TCourseModalFormData
  ) => Promise<boolean> | undefined;
  formData: TCourseModalFormData | undefined;
};
type TModalState = { open: boolean; modal: ReactNode | undefined };
type TOpenModalParam = {
  modal?: ReactNode;
  modalMetadata: TModalMetadata;
};
export type TCourseDispatch = React.Dispatch<{
  type: TCourseReducerAction;
  payload?: any;
}>;

type TCourseContext = {
  dispatch: TCourseDispatch;
  course: TFetchState<TCourse | undefined>;
  openModal: (config: TOpenModalParam) => void;
  closeModal: () => void;
  modal: TModalState;
  modalMetadata: TModalMetadata;
  modalFormState: TCourseModalFormData;
  setModalFormState?: React.Dispatch<
    React.SetStateAction<TCourseModalFormData>
  >;
  modalRequestState: TFetchState<any>;
  setModalRequestState: React.Dispatch<React.SetStateAction<TFetchState<any>>>;
};

const CourseContext = createContext<TCourseContext | undefined>(undefined);

const courseReducer: Reducer<
  TFetchState<TCourse | undefined>,
  { type: TCourseReducerAction; payload?: any }
> = (state, action) => {
  if (action.type === 'ADD_COURSE') {
    return {
      data: action.payload,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'FETCHING_COURSE') {
    return {
      data: undefined,
      loading: true,
      error: undefined,
    };
  }

  if (action.type === 'ERROR_FETCHING_COURSE') {
    return {
      data: undefined,
      loading: false,
      error: action.payload,
    };
  }

  if (action.type === 'EDIT_COURSE') {
    if (state.data) {
      //the fields we need
      //department, title, chapters, courseCover, description, startDate, endDate, isActive.
      const newState = { ...state.data };
      console.log(newState, 'newState');
      newState.title = action.payload.title || '';
      newState.description = action.payload.description || '';
      newState.department = action.payload.classId || '';
      newState.department = action.payload.department || '';
      newState.startDate = action.payload.startDate || '';
      newState.endDate = action.payload.endDate || '';
      newState.isActive = action.payload.isActive || false;
      action.payload.courseCover &&
        (newState.courseCover = action.payload.courseCover);

      return {
        data: newState,
        loading: false,
        error: undefined,
      };
    }
  }

  if (action.type === 'CREATE_CHAPTER') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Search if a chapter with this id has been previously created
    const chapterExists = modifiedCourse.chapters?.find(
      (chapter) => chapter._id === action.payload._id
    );

    // * If the chapter with this id hasn't been created, create one
    if (!chapterExists) {
      modifiedCourse.chapters?.push({
        _id: action.payload._id || '',
        title: action.payload?.title || '',
        lessons: [],
        courseId: action.payload.courseId || '',
        currentTutorial: {
          type: 'none',
          id: '',
        },
      });

      console.log('Created chapter');
    }

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'CREATE_LESSON') {
    // Create a new object from the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // Retrieve the chapter where the lesson will be created
    const chapterToUpdate = modifiedCourse.chapters?.find(
      (chapter) => chapter._id === action.payload.parentId
    );

    // Check if a lesson with this id already exists
    const createdLesson = chapterToUpdate?.lessons?.find(
      (lesson) => lesson._id === action.payload?._id
    );

    if (!createdLesson) {
      chapterToUpdate?.lessons.push({
        _id: action.payload._id || '',
        title: action.payload.title || '',
        sections: [],
        chapterId: action.payload.chapterId || '',
        topicImage: action.payload.topicImage || null,
        topicNote: action.payload.topicNote || '',
        topicVideo: action.payload.topicVideo || null,
        youtubeVideo: action.payload.youtubeVideo || null,
        isActive: action.payload.isActive || false,
        availableDate: action.payload.availableDate || '',
        startDate: action.payload.startDate || '',
        endDate: action.payload.endDate || '',
        embed: action.payload.embed || null,
      });
      console.log('Created lesson');
    }

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'CREATE_TOPIC') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Loop through each chapter in the course
    for (const chapter of modifiedCourse?.chapters || []) {
      // * Search for the lesson which the topic/section will be created in/added to
      const lessonToUpdate = chapter.lessons.find(
        (lesson) => lesson._id === action.payload.parentId
      );

      // * If the lesson which the topic will be added to exists
      if (lessonToUpdate) {
        // * Check if this topic/section has been previously created
        const sectionExists = lessonToUpdate?.sections?.find(
          (section) => section._id === action.payload._id
        );

        // * If the topic with this id hasn't been created in this lesson yet, create it
        if (!sectionExists) {
          lessonToUpdate?.sections?.push({
            _id: action.payload._id || '',
            title: action.payload?.title || '',
            topicNote: action.payload?.topicNote || '',
            topicVideo: action.payload?.topicVideo || '',
            youtubeVideo: action.payload?.youtubeVideo || '',
            embed: action.payload?.embed || '',
            topicImage: action.payload?.topicImage || null,
            lessonId: action.payload.lessonId || '',
            subsections: [],
          });
          console.log('Created topic');
          break;
        }
      }
    }

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  //omO i AM having to change whole context, omlll
  if (action.type === 'CREATE_SUBSECTION') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Loop through each chapter in the course
    for (const chapter of modifiedCourse?.chapters || []) {
      for (const lesson of chapter.lessons) {
        // * Search for the topic which the subsection will be created in/added to

        const topicToUpdate = lesson.sections.find(
          (section) => section._id === action.payload.parentId
        );

        // * If the lesson which the topic will be added to exists
        if (topicToUpdate) {
          // * Check if this topic/section has been previously created
          const sectionExists = topicToUpdate?.subsections?.find(
            (subsection) => subsection._id === action.payload._id
          );

          // * If the topic with this id hasn't been created in this lesson yet, create it
          if (!sectionExists) {
            topicToUpdate?.subsections?.push({
              _id: action.payload._id || '',
              title: action.payload?.title || '',
              topicNote: action.payload?.topicNote || '',
              topicVideo: action.payload?.topicVideo || '',
              youtubeVideo: action.payload?.youtubeVideo || '',
              embed: action.payload?.embed || '',
              topicImage: action.payload?.topicImage || null,
              lessonId: action.payload.lessonId || '', // add a sectionId to the payload
              // subsections: [],
            });
            console.log('Created subsection');
            break;
          }
        }
      }
    }

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'EDIT_CHAPTER') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Retrieve the index of the chapter with this chapter id
    const chapterToUpdateIndex = modifiedCourse.chapters?.findIndex(
      (chapter) => chapter._id === action.payload._id
    );

    // * If the chapter exists, update it
    if (chapterToUpdateIndex !== undefined && modifiedCourse.chapters) {
      const oldChapterDetails = {
        ...modifiedCourse.chapters?.[chapterToUpdateIndex],
      };

      console.log('Edit chapter payload', action.payload);
      modifiedCourse.chapters[chapterToUpdateIndex] = {
        ...oldChapterDetails,
        ...action.payload,
      };
    }

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'EDIT_LESSON') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Retrieve the chapter which the lesson will be created in
    const chapterToUpdate = modifiedCourse.chapters?.find(
      (chapter) => chapter._id === action.payload.parentId
    );

    // * Get the lesson with this id from the list
    const createdLessonIndex = chapterToUpdate?.lessons?.findIndex(
      (lesson) => lesson._id === action.payload?._id
    );

    // * If the lesson was found update it
    if (createdLessonIndex !== undefined && chapterToUpdate?.lessons) {
      console.log('Edit lesson payload', action.payload);

      const oldLessonData = {
        ...chapterToUpdate.lessons?.[createdLessonIndex],
      };
      chapterToUpdate.lessons[createdLessonIndex] = {
        ...oldLessonData,
        ...action.payload,
      };
    }

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'EDIT_TOPIC') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Loop through each chapter in the course
    for (const chapter of modifiedCourse?.chapters || []) {
      // * Search for the lesson which the topic/section will be created in/added to
      const lessonToUpdate = chapter.lessons.find(
        (lesson) => lesson._id === action.payload.parentId
      );

      // * If the lesson which the topic will be added to exists
      if (lessonToUpdate) {
        // * Check if this topic/section has been previously created
        const createdSectionId = lessonToUpdate?.sections?.findIndex(
          (section) => section._id === action.payload._id
        );

        // * If the section/topic exists, update it's details
        if (createdSectionId !== undefined && lessonToUpdate?.sections) {
          console.log('Edit section payload', action.payload);

          const oldSectionDetails = {
            ...lessonToUpdate.sections?.[createdSectionId],
          };
          lessonToUpdate.sections[createdSectionId] = {
            ...oldSectionDetails,
            ...action.payload,
          };

          break;
        }
      }
    }

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'DELETE_CHAPTER') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Filter out the chapter with this id from the list of chapters
    const filteredChapters = modifiedCourse.chapters?.filter(
      (chapter) => chapter._id !== action.payload._id
    );

    // * Replace the list of chapters with the filtered chapters
    if (filteredChapters) modifiedCourse.chapters = [...filteredChapters];

    console.log('GOT HERE: CHAPTER', filteredChapters, action.payload);

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'DELETE_LESSON') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Retrieve the chapter which the lesson will be created in
    const chapterToUpdate = modifiedCourse.chapters?.find(
      (chapter) => chapter._id === action.payload.parentId
    );

    // * Filter out the lesson with this id from the list of lessons
    const filteredLessons = chapterToUpdate?.lessons?.filter(
      (lesson) => lesson._id !== action.payload?._id
    );

    // * Replace the list of lessons with the filtered lessons
    if (filteredLessons && chapterToUpdate)
      chapterToUpdate.lessons = [...filteredLessons];

    console.log('GOT HERE: LESSON', filteredLessons, action.payload);

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  if (action.type === 'DELETE_TOPIC') {
    // * Create a new object from the the course details state
    const modifiedCourse = { ...(state.data || {}) };

    // * Loop through each chapter in the course
    for (const chapter of modifiedCourse?.chapters || []) {
      // * Search for the lesson which the topic/section will be created in/added to
      const lessonToUpdate = chapter.lessons.find(
        (lesson) => lesson._id === action.payload.parentId
      );

      // * If the lesson which the topic will be added to exists
      if (lessonToUpdate) {
        // * Filter out the sections/topics with this id from the list of sections/topics
        const filteredSections = lessonToUpdate?.sections?.filter(
          (section) => section._id !== action.payload._id
        );

        // * Replace the list of section with the filtered section
        if (filteredSections && lessonToUpdate) {
          lessonToUpdate.sections = [...filteredSections];

          break;
        }

        console.log(
          'GOT HERE: SECTIONS lessons',
          lessonToUpdate,
          action.payload
        );
      }

      console.log(
        'GOT HERE: SECTIONS chapters',
        chapter,
        lessonToUpdate,
        action.payload
      );
    }

    return {
      data: modifiedCourse,
      loading: false,
      error: undefined,
    };
  }

  return { data: state.data, loading: false, error: undefined };
};

const CourseContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const initialFormState: TCourseModalFormData = {
    title: '',
    _id: '',
    department: '',
    isActive: false, //isActive is false by default
    startDate: '',
    endDate: '',
    description: '',
    image: '',
    topicNote: '',
    topicVideo: '',
    youtubeVideo: '',
    embed: '',
    availableDate: '',
  };
  const [modal, setModal] = useState<TModalState>({
    open: false,
    modal: undefined,
  });
  const [course, dispatch] = useReducer(courseReducer, {
    data: undefined,
    loading: true,
    error: undefined,
  });
  const [modalMetadata, setModalMetadata] = useState<TModalMetadata>({
    mode: undefined,
    type: undefined,
    handleAction: undefined,
    formData: undefined,
    handleDelete: undefined,
  });
  const [modalFormState, setModalFormState] =
    useState<TCourseModalFormData>(initialFormState);
  const [requestState, setRequestState] = useState<
    TFetchState<TCourseModalFormData | undefined>
  >({ data: undefined, loading: false, error: undefined });

  const openModal = (config: TOpenModalParam) => {
    const formData = config.modalMetadata.formData;
    setModalMetadata({ ...config.modalMetadata });
    formData && setModalFormState(formData);
    setModal({ open: true, modal: config?.modal });
  };
  const closeModal = () => {
    setRequestState({
      data: undefined,
      loading: false,

      error: undefined,
    });
    setModalMetadata({
      mode: undefined,
      type: undefined,
      handleAction: undefined,
      handleDelete: undefined,
      formData: undefined,
    });
    setModalFormState(initialFormState);
    setModal({ open: false, modal: undefined });
  };

  return (
    <>
      <CourseContext.Provider
        value={{
          modal,
          course,
          dispatch,
          closeModal,
          openModal,
          modalMetadata: {
            ...modalMetadata,
          },
          setModalFormState: setModalFormState,
          modalFormState: modalFormState,
          setModalRequestState: setRequestState,
          modalRequestState: requestState,
        }}
      >
        {children}
      </CourseContext.Provider>
    </>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);

  if (!context)
    throw new Error(
      'useCourseContext must be used within the CourseContextProvider'
    );

  return context;
};

export default CourseContextProvider;
