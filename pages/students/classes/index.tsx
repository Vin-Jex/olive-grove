import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React, { useCallback, useEffect, useState } from "react";
import SubjectCard from "@/components/Molecules/Card/SubjectCard";
import Link from "next/link";
import withAuth from "@/components/Molecules/WithAuth";
import { TCourse, TFetchState } from "@/components/utils/types";
import { fetchCourses } from "@/components/utils/course";

export const subjectData = [
  {
    subject: "Further Mathematics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Calculus",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Chemistry",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Organic Chemistry",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Physics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Motion",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Mathematics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Trigonomentry",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
];

const Classes = () => {
  const [courses, setCourses] = useState<TFetchState<TCourse[]>>({
    data: [],
    loading: false,
    error: undefined,
  });
  const getCourses = useCallback(
    async (filter?: { query: "title"; value: string }) => {
      setCourses({
        data: [],
        loading: true,
        error: undefined,
      });

      try {
        // Call the reusable getCourses function, passing the setClasses state updater
        const courses = await fetchCourses(filter);

        if (Array.isArray(courses)) {
          // Set the courses state to the fetched list of courses
          setCourses({
            data: courses,
            loading: false,
            error: undefined,
          });
        } else {
          setCourses({
            data: [],
            loading: false,
            error: courses,
          });
        }
        console.log(courses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    },
    []
  );

  useEffect(() => {
    getCourses();
  }, [getCourses]);
  return (
    <StudentWrapper title="Classes" metaTitle="Olive Groove ~ Classes">
      <div className="p-12 space-y-5">
        {/* Title */}
        <div className="flex flex-col">
          <span className="text-lg font-medium text-dark font-roboto">
            Explore your classes
          </span>
          <span className="text-md text-subtext font-roboto">
            Manage and join your classes.
          </span>
        </div>

        <div className="grid grid-cols-3 h-fit w-full gap-8 !mt-8">
          {courses.data.map((subject, index) => (
            <SubjectCard
              key={subject._id}
              name={"No Teacher Name"}
              role={"Teacher"}
              time={"time"}
              topic={subject.description as string}
              subject={subject.title}
              btnLink1={""}
              btnLink2={`/students/classes/${subject._id}`}
            />
          ))}
        </div>
      </div>
    </StudentWrapper>
  );
};

export default withAuth("Student", Classes);
