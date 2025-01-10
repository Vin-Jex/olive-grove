import SubjectCard from "@/components/Molecules/Card/SubjectCard";
import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React, { useEffect, useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import axiosInstance from "@/components/utils/axiosInstance";
import { baseUrl } from "@/components/utils/baseURL";
import Loader from "@/components/Atoms/Loader";

type TAssessment = {
  _id: string;
  teacher: {
    _id: string;
    name: string;
    email: string;
    tel: number;
    address: string;
    profileImage: string;
    role: string;
    teacherID: string;
    __v: number;
    archivedAt: null;
    deletedAt: null;
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
    endDate: null;
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
  questions: [];
  submissions: [];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const Assessments = () => {
  const [currentAssessments, setCurrentAssessments] = useState<TAssessment[]>(
    []
  ); //properly type this.
  const [isLoading, setIsLoading] = useState(false);

  //   {
  //     "_id": "675cf360cb774c9aea59c661",
  //     "teacher": {
  //         "_id": "675b33d1e34669e6f4d8ae69",
  //         "name": "Prince Onukwili",
  //         "email": "onukwilip@gmail.com",
  //         "tel": 9068985453,
  //         "address": "123 Main Street, City, Country",
  //         "profileImage": "https://res.cloudinary.com/difc1xy6v/image/upload/v1734030289/teachers-files/bhdixpxlytdzrvkmwxk9.png",
  //         "role": "Teacher",
  //         "teacherID": "WBM071XMIT",
  //         "__v": 0,
  //         "archivedAt": null,
  //         "deletedAt": null,
  //         "isActive": true,
  //         "isArchived": false,
  //         "isDeleted": false,
  //         "isVerified": true,
  //         "lastLoginAt": "2024-12-16T00:12:28.146Z",
  //         "updatedAt": "2024-12-18T13:04:38.462Z"
  //     },
  //     "class": {
  //         "_id": "67576e9f9f0bd5d21180cf0e",
  //         "name": "JSS2",
  //         "category": "Junior Secondary",
  //         "description": "All student in grade 8 are enrolled here",
  //         "createdAt": "2024-12-09T22:26:39.298Z",
  //         "updatedAt": "2024-12-09T22:26:39.298Z",
  //         "__v": 0
  //     },
  //     "academicWeek": {
  //         "_id": "675b375c773ae13497873058",
  //         "startDate": "2024-12-12T00:00:00.000Z",
  //         "endDate": "2024-12-17T00:00:00.000Z",
  //         "weekNumber": 1,
  //         "academicYear": "2024",
  //         "isActive": true,
  //         "createdAt": "2024-12-12T19:19:56.950Z",
  //         "updatedAt": "2024-12-12T19:19:56.950Z",
  //         "__v": 0
  //     },
  //     "course": {
  //         "startDate": "2024-12-20T07:42:28.374Z",
  //         "endDate": null,
  //         "isActive": true,
  //         "_id": "67589f64a1d35d763cc96edc",
  //         "classId": "67576e9f9f0bd5d21180cf0e",
  //         "title": "AI and Machine Learning",
  //         "courseCover": "https://res.cloudinary.com/difc1xy6v/image/upload/v1733861220/course-files/xitkm6bgruysv12aotvd.png",
  //         "chapters": [
  //             "67589f95a8defe16bc4d4909"
  //         ],
  //         "createdAt": "2024-12-10T20:07:00.644Z",
  //         "updatedAt": "2024-12-10T20:07:49.860Z",
  //         "__v": 1
  //     },
  //     "assessmentType": {
  //         "_id": "675b35b441557ee8108e3b5f",
  //         "name": "Mid-Term Exam",
  //         "__v": 0
  //     },
  //     "description": "<p>Demo notes</p>",
  //     "dueDate": "2024-12-15T02:55:00.000Z",
  //     "active": true,
  //     "questions": [],
  //     "submissions": [],
  //     "createdAt": "2024-12-14T02:54:24.148Z",
  //     "updatedAt": "2024-12-14T02:54:24.148Z",
  //     "__v": 0
  // },

  useEffect(() => {
    const fethchAssessments = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance(`${baseUrl}/api/v2/assessments`);
        console.log(response.data, "currentAssessment data");
        setCurrentAssessments(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fethchAssessments();
  }, []);
  return (
    <StudentWrapper
      remark='Manage, submit and access your assessments.'
      title='Assessments'
      metaTitle='Olive Grove ~ Assessments'
    >
      {isLoading && <Loader />}
      <div className='grid max-md:place-items-center md:grid-cols-2 lg:grid-cols-3 h-fit w-full gap-8 my-4'>
        {currentAssessments?.map((subject, index) => (
          <SubjectCard
            key={index}
            assessments
            toggleModal={() => {}}
            img={subject?.teacher?.profileImage}
            // type="assessment"
            category={subject?.assessmentType?.name}
            name={subject?.teacher?.name}
            role={"Teacher"}
            time={subject?.dueDate}
            topic={subject?.description}
            subject={subject?.course?.title}
            btnLink2={`/students/assessments/${subject?._id?.toLocaleLowerCase()}`}
          />
        ))}
      </div>
    </StudentWrapper>
  );
};

// export default Assessments;
export default withAuth("Student", Assessments);
