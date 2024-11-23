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
  viewed?: boolean;
} & OptionalFields;

export type TSection = {
  _id?: string;
  title: string;
  viewed?: boolean;
  subsections: TSubSection[];
} & OptionalFields;

export type TSubSection = {
  _id?: string;
  title: string;
  description?: string;
  viewed?: boolean;
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
  subject: TCourse | string;
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

export type TAcademicWeek = {
  startDate: string;
  endDate: string;
  weekNumber: number;
  academicYear: string;
  isActive: true;
  _id?: string;
};

export type TAssessment<T extends "post" | "get"> = {
  _id?: string;
  subject: T extends "post" ? string : TCourse;
  type: T extends "post" ? string : TAssessmentType;
  description: string;
  timeline: string | Date;
  teacher: T extends "post" ? string : TTeacher;
  academicWeek: T extends "post" ? string : TAcademicWeek;
  class: T extends "post" ? string : TClass;
};

export type TStudent = {
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  graduated?: boolean | null;
  graduatedYear?: Date | null;
  academicSection?: string | null;
  repeated?: { year?: Date; repeated?: boolean }[];
  department: string;
  username: string;
  password: string;
  studentID: string;
  middleName?: string;
  profileImage?: string | null;
  role?: string;
  enrolledSubjects?: string[];
};

export type TTeacher = {
  name: string;
  teacherID: string;
  email: string;
  tel: number;
  address: string;
  password: string;
  profileImage?: string;
  role?: string;
  _id: string;
};

export type TAdmin = {
  name: string;
  username: string;
  password: string;
  profileImage?: string;
  role?: string;
};

export type TModalProps<T> = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleAction?: (formData: T) => Promise<boolean>;
  handleDelete?: (formData: T) => Promise<boolean>;
  requestState?: TFetchState<any>;
  mode: "create" | "edit";
  formState: T;
  setFormState: React.Dispatch<React.SetStateAction<T>>;
};

export type TAssessmentType = {
  _id: string;
  name: string;
};

export type TTopicDetails = {
  path: [string, string, string] | undefined;
  topicChapter: string;
  topicLesson: string;
  type: "section" | "lesson";
  topic: TSection | undefined;
};
