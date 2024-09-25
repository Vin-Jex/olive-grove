export type TSubject = {
  image_url: string;
  course_name: string;
  lessons_no: number;
};

type OptionalFields = {
  classId?: string;
  chapterId?: string;
  topicNote?: string;
  topicVideo?: string;
  youtubeVideo?: string;
  description?: string;
  topicImage?: string;
  lessonId?: string;
};

export type TCourse = {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  chapters: TChapter[];
} & OptionalFields;

export type TChapter = {
  _id?: string;
  title: string;
  lessons: TLesson[];
} & OptionalFields;

export type TLesson = {
  _id?: string;
  title: string;
  sections: TSection[];
} & OptionalFields;

export type TSection = {
  _id?: string;
  title: string;
  subsections: TSubSection[];
} & OptionalFields;

export type TSubSection = {
  _id?: string;
  title: string;
  description?: string;
} & OptionalFields;

export type TResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type TFetchState<T> = {
  data: T;
  loading: boolean;
  error:
    | undefined
    | string
    | { state: boolean | string | undefined; status: number; message: string };
};

export type TClass = {
  _id: string;
  name: string;
  category: string;
  description?: string;
};

export type THandleSearchChange<T> = (
  e: React.ChangeEvent<HTMLInputElement>,
  config: {
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    initialData: T[];
    setSearchResults: React.Dispatch<React.SetStateAction<T[]>>;
  }
) => void;
