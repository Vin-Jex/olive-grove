import React, { useState, useEffect, useCallback } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import AssessmentCard from "@/components/Molecules/Card/AssessmentCard";
import { baseUrl } from "@/components/utils/baseURL";
import Cookies from "js-cookie";
import NotFoundError from "@/components/Atoms/NotFoundError";
import ServerError from "@/components/Atoms/ServerError";
import Loader from "@/components/Atoms/Loader";

interface AssessmentData {
  _id: string;
  subject: string;
  description: string;
  classTime: string;
  meetingLink: string;
  teacher: string;
  isActive: boolean;
  academicWeekDate: string;
}

const Assessments = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status: 404 | 500; msg: string }>();
  const router = useRouter();

  const fetchAssessments = useCallback(async () => {
    try {
      const userId = Cookies.get("userId");
      const token = Cookies.get("jwt");
      setLoading(true);
      const response = await fetch(`${baseUrl}/teacher/${userId}/assessments`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        // const errorData = await response.json();
        if (
          // response.status === "No lectures found for the provided teacher ID."
          response.status === 404
        ) {
          setError({
            msg: "No assessments found for your profile.",
            status: 404,
          });
        } else {
          setError({ msg: "Failed to load assessments.", status: 500 });
        }
        return;
      }

      const data = await response.json();
      setAssessments(data?.data);
    } catch (err) {
      setError({ msg: "Failed to load assessments", status: 500 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  return (
    <TeachersWrapper title="Assessments" metaTitle="Olive Groove ~ Assessments">
      <div className="space-y-5 h-full">
        {loading ? (
          <div className="h-full w-full">
            <Loader />
          </div>
        ) : error ? (
          <>
            {error.status === 404 ? (
              <NotFoundError msg={error.msg} />
            ) : (
              <ServerError msg={error.msg} />
            )}
          </>
        ) : assessments.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <NotFoundError msg={"No assessments available at the moment."} />
          </div>
        ) : (
          <>
            {/* Title */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-medium text-dark font-roboto">
                  Access Assessments
                </span>
                <span className="text-md text-subtext font-roboto">
                  Manage, create and access assessments.
                </span>
              </div>
              <Button
                size="xs"
                width="fit"
                onClick={() => router.push(`/teachers/assessments/create`)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M15.0001 10.8317H10.8334V14.9984C10.8334 15.2194 10.7456 15.4313 10.5893 15.5876C10.4331 15.7439 10.2211 15.8317 10.0001 15.8317C9.77907 15.8317 9.56711 15.7439 9.41083 15.5876C9.25455 15.4313 9.16675 15.2194 9.16675 14.9984V10.8317H5.00008C4.77907 10.8317 4.56711 10.7439 4.41083 10.5876C4.25455 10.4313 4.16675 10.2194 4.16675 9.99837C4.16675 9.77736 4.25455 9.5654 4.41083 9.40912C4.56711 9.25284 4.77907 9.16504 5.00008 9.16504H9.16675V4.99837C9.16675 4.77736 9.25455 4.5654 9.41083 4.40912C9.56711 4.25284 9.77907 4.16504 10.0001 4.16504C10.2211 4.16504 10.4331 4.25284 10.5893 4.40912C10.7456 4.5654 10.8334 4.77736 10.8334 4.99837V9.16504H15.0001C15.2211 9.16504 15.4331 9.25284 15.5893 9.40912C15.7456 9.5654 15.8334 9.77736 15.8334 9.99837C15.8334 10.2194 15.7456 10.4313 15.5893 10.5876C15.4331 10.7439 15.2211 10.8317 15.0001 10.8317Z"
                    fill="#FDFDFD"
                  />
                </svg>
                <span>Create Task</span>
              </Button>
            </div>
            {/* Assessment list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 2xl:gap-8">
              {assessments.map((assessment, index) => (
                <AssessmentCard
                  key={assessment._id}
                  name={assessment.subject}
                  role={assessment.description}
                  time={new Date(assessment.classTime).toLocaleString()}
                  subject={assessment.subject}
                  assessmentType="Class Work"
                  btnLink1={() => {
                    router.push(`/teachers/assessments/${assessment._id}`);
                  }}
                  btnLink2={() => {
                    router.push(`/teachers/assessments/create`);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </TeachersWrapper>
  );
};

export default withAuth("Teacher", Assessments);
