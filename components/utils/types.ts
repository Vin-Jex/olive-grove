import { InputHTMLAttributes, ReactNode } from 'react';

export type TSubject = {
  image_url: string;
  course_name: string;
  lessons_no: number;
};

type OptionalFields<T extends 'get' | 'post' = 'get'> = {
  department?: T extends 'post' ? string : TDepartment;
  // courseInfo?: { description: string };
  chapterId?: string;
  embed?: string;
  topicNote?: string;
  topicVideo?: string;
  youtubeVideo?: string;
  description?: string;
  topicImage?: string;
  lessonId?: string;
  viewed?: boolean;
  availableDate?: string;
};

export type TCourse<T extends 'get' | 'post' = 'get'> = {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  isActive?: string | boolean; //note we are using string her as YES or NO
  startDate?: string;
  endDate?: string;
  chapters?: TChapter[];
  courseCover?: string | File | undefined;
} & OptionalFields<T>;

export type TChapter<T extends 'get' | 'post' = 'get'> = {
  _id?: string;
  title: string;
  lessons: TLesson[];
  isActive?: string | boolean; //note we are using string her as YES or NO
  startDate?: string;
  endDate?: string;
  courseId: string;
  currentTutorial: {
    type: string;
    id: string;
  };
} & OptionalFields<T>;

export type TLesson<T extends 'get' | 'post' = 'get'> = {
  _id?: string;
  title: string;
  sections: TSection[];
  chapterId: string;
  viewed?: boolean;
  availableDate?: Date;
  isActive?: string | boolean; //note we are using string her as YES or NO
  startDate?: string;
  endDate?: string;
  currentTutorial?: boolean;
  topicVideo: string | null;
  youtubeVideo: string | null;
  embed: string | null;
  topicNote: string;
  topicImage: string | null;
} & OptionalFields<T>;

export type TSection<T extends 'get' | 'post' = 'get'> = {
  _id?: string;
  title: string;
  subsections: TSubSection[];
  lessonId: string;
  viewed?: boolean;
  availableDate?: Date | string; //this should ideally be a string
  isActive?: string | boolean; //note we are using string her as YES or NO
  endDate?: string;
  startDate?: string;
  currentTutorial?: boolean;
  topicVideo: string | null;
  youtubeVideo: string | null;
  embed: string | null;
  topicNote: string;
  topicImage: string | null;
} & OptionalFields<T>;

export type TSubSection<T extends 'get' | 'post' = 'get'> = {
  _id?: string;
  title: string;
  description?: string;
  sectionId?: string;
  lessonId: string;
  viewed?: boolean;
  availableDate?: Date;
  isActive?: string; //note we are using string her as YES or NO
  currentTutorial?: boolean;
  topicVideo: string | null;
  youtubeVideo: string | null;
  embed?: string | null;
  topicNote: string;
  topicImage: string | null;
} & OptionalFields<T>;

export type TResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type TErrorState = {
  state: boolean | string | undefined;
  status: number;
  message: string;
};

export type TFetchState<T> = {
  data: T;
  loading: boolean;
  error: undefined | string | TErrorState;
};

export type TDepartment = {
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
  fileType?: 'video' | 'image';
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
  | Omit<TCourse<'post'>, 'chapters'>
  | Omit<TChapter<'post'>, 'lessons'>
  | Omit<TLesson<'post'>, 'sections'>
  | Omit<TSection<'post'>, 'subsections'>;

export type TCourseModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleDelete?: (formData?: TCourseModalFormData) => Promise<boolean>;
  handleAction?: (formData?: TCourseModalFormData) => Promise<boolean>;
  type: 'course' | 'chapter' | 'lesson' | 'topic' | 'subsection';
  mode: 'create' | 'edit' | 'delete';
  formState: TCourseModalFormData;
  setFormState: React.Dispatch<React.SetStateAction<TCourseModalFormData>>;
  requestState?: TFetchState<any>;
  departments?: TSelectOptions;
};

export type TAcademicWeek = {
  startDate: string;
  endDate: string;
  weekNumber: number;
  academicYear: string;
  isActive: true;
  _id?: string;
};

export type TAssessment<T extends 'post' | 'get'> = {
  _id?: string;
  // subject?: T extends 'post' ? string : TCourse;
  assessmentType: T extends 'post' ? string : TAssessmentType;

  description: string;
  title: string;
  dueDate: string | Date;

  teacher: T extends 'post' ? string : TTeacher;
  academicWeek: T extends 'post' ? string : TAcademicWeek;
  department: T extends 'post' ? string : TDepartment;
  course: T extends 'post' ? string : TCourse;
  active: boolean;
};

export type TQuestionCard = {
  _id: string;
  teacher: {
    _id: string;
    name: string;
    email: string;
    tel: number;
    address: string;
    password: string;
    profileImage: string;
    role: string;
    teacherID: string;
    __v: number;
    archivedAt: string | null;
    deletedAt: string | null;
    isActive: boolean;
    isArchived: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    lastLoginAt: string;
    updatedAt: string;
  };
  class: {
    _id: string;
    name: string;
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  academicWeek: {
    _id: string;
    startDate: string;
    endDate: string;
    weekNumber: number;
    academicYear: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  course: {
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    _id: string;
    classId: string;
    title: string;
    courseCover: string;
    chapters: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  assessmentType: {
    _id: string;
    name: string;
    __v: number;
  };
  description: string;
  dueDate: string;
  active: boolean;
  questions: {
    fileRequirements: {
      maxSizeMB: number;
      allowedExtensions: string[];
    };
    questionImages: string[];
    questionText: string;
    questionType: string;
    options: string[];
    yourAnswer: string;
    correctAnswer: string;
    maxMarks: number;
    _id: string;
  }[];
  submissions: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type UserRole = 'Teacher' | 'Student' | 'Admin';
export enum EUserRole {
  Admin = 'Admin',
  Student = 'Student',
  Teacher = 'Teacher',
}

export type TStudent = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date | string;
  department: string;
  username: string;
  password: string;
  studentID: string;
  role: EUserRole;
  archivedAt: Date | null;
  deletedAt: Date | null;
  isActive: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  lastLoginAt: Date | null;
  updatedAt: Date;
  middleName: string;
  profileImage: string | null;
  enrolledSubjects: [];
  repeated: { year?: Date; repeated?: boolean }[];
  graduated: boolean | null;
  graduatedYear: Date | null;
  academicSection: string | null;
  gender: string | null;
};

export type TStudentCorrect = {
  department: { category: string; name: string; _id: string };
} & TStudent;

export type TTeacher = {
  name: string;
  teacherID: string;
  email: string;
  tel: number;
  address: string;
  password: string;
  profileImage?: string;
  _id: string;
  role: EUserRole;
  archivedAt: Date | null;
  deletedAt: Date | null;
  isActive: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  lastLoginAt: Date | null;
  updatedAt: Date;
  gender: string | null;
  academicSection: string | null;
  teachingCourses: [];
};

export type TAdmin = {
  _id: string;
  adminID: string;
  name: string;
  username: string;
  password: string;
  profileImage?: string;
  role: EUserRole;
  archivedAt: Date | null;
  deletedAt: Date | null;
  isActive: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  lastLoginAt: Date | null;
  updatedAt: Date;
  gender: string | null;
  academicSection: string | null;
};

export type TUser = TStudent | TTeacher | TAdmin | TStudentCorrect;

export type TModalProps<T> = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleAction?: (formData: T) => Promise<boolean>;
  handleDelete?: (formData: T) => Promise<boolean>;
  requestState?: TFetchState<any>;
  mode: 'create' | 'edit';
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
  type: 'section' | 'lesson' | 'subsection';
  topic: TSection | TLesson | TSubSection | undefined;
};

export type TLoginResponse<T extends 'student' | 'teacher' | 'admin'> = {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  details: T extends 'student'
    ? TStudent
    : T extends 'teacher'
    ? TTeacher
    : TAdmin;
};

export type TAssessmnentQuestionProp = {};

export type TAssessmnentQuestion<T extends 'draft' | 'preview' = 'preview'> = {
  _id: string;
  questionText: string;
  questionImages?: [string];
  questionType: TAssessmentQuestionType;
  options?: T extends 'draft' ? TAsseessmentQuestionOption[] : string[];
  correctAnswer?: T extends 'draft' ? TAsseessmentQuestionOption : string;
  fileRequirements?: {
    maxSizeMB: number;
    allowedExtensions: string[];
  };
  maxMarks: number;
};

export type TAssessmentQuestionType =
  | 'multiple_choice'
  | 'paragraph'
  | 'file_upload'
  | 'select_many';

export type TContentId = { id: string; isViewed: boolean }[];

export type TAsseessmentQuestionOption = {
  content: string | undefined;
  _id: string;
};

export type TAssessmentQuestionFileUpload = {
  maxSizeMB: number;
  allowedExtensions: string[];
};

export type TSideDialogContent = {
  title: string | ReactNode;
  icon: string | ReactNode;
  action: Function;
  className?: string;
};

export type TWarningModalProps = {
  modalOpen: boolean;
  loading: boolean;
  handleModalClose: () => void;
  handleConfirm?: () => void;
};

export type InputType =
  | 'button'
  | 'text'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'time'
  | 'week'
  | 'url'
  | 'select'
  | 'textarea';

export type TErrorStatus = 404 | 500 | 403 | 401;

export type TAsseessmentQuestionMode = 'add' | 'edit' | 'preview';
