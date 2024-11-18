import { InputHTMLAttributes } from "react";

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
  chapters?: TChapter[];
  courseCover?: string | File | undefined;
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
  _id?: string;
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

export interface IImageUploadProps
  extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<Blob | null | undefined | string>
  >;
  resetImageStates: () => void;
  selectedImage: Blob | null | undefined | string;
  previewImage: Blob | null | string;
  fileName: string;
}

export interface ILectureData {
  _id: string;
  subject: string;
  description: string;
  classTime: string;
  meetingLink: string;
  teacher: string;
  isActive: boolean;
  academicWeekDate: string;
  recordedLecture: string;
  attendance: {
    student: string;
    attended: boolean;
    timestamp: string;
  }[];
}

export type TSelectOptions = (
  | string
  | { value: string; display_value: string; [x: string]: string }
)[];

export type TCourseModalFormData =
  | Omit<TCourse, "chapters">
  | Omit<TChapter, "lessons">
  | Omit<TLesson, "sections">
  | Omit<TSection, "subsections">;

export type TCourseModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleDelete?: (formData?: TCourseModalFormData) => Promise<boolean>;
  handleAction?: (formData?: TCourseModalFormData) => Promise<boolean>;
  type: "course" | "chapter" | "lesson" | "topic";
  mode: "create" | "edit";
  formState: TCourseModalFormData;
  setFormState: React.Dispatch<React.SetStateAction<TCourseModalFormData>>;
  requestState?: TFetchState<any>;
  classes?: TSelectOptions;
};
