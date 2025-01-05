import React, { useEffect, useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Tab, { TTabBody } from "@/components/Molecules/Tab/Tab";
import ModifyAssessment from "@/components/Atoms/Assessment/ModifyAssessment";
import AssessmentResponses from "@/components/Atoms/Assessment/AssessmentResponses";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Atoms/Button";
import Loader from "@/components/Atoms/Loader";
import ErrorUI from "@/components/Atoms/ErrorComponent";
import ServerError from "@/components/Atoms/ServerError";
import { TFetchState } from "@/components/utils/types";

const tab_body: TTabBody[] = [
  {
    slug: "questions",
    content: <ModifyAssessment />,
  },
  {
    slug: "responses",
    content: <AssessmentResponses />,
  },
];

const EachAssessment = () => {
  const router = useRouter();
  const { role } = useAuth();
  const { assessmentId } = router.query;
  // const {
  //   sendRequest: getAssessment,
  //   loading: loadingAssessment,
  //   error: errorFetchingAssessment,
  // } = useAjaxRequest<{ message: string }>({
  //   config: {},
  //   instance: axiosInstance,
  // });

  // ! REMOVE
  const [
    {
      data: assessment,
      error: errorFetchingAssessment,
      loading: loadingAssessment,
    },
    setFetchAssessmentState,
  ] = useState<TFetchState<Record<string, any>>>({
    data: {},
    loading: false,
    error: undefined,
  });

  const fetchAssessment = async () => {
    try {
      // await getAssessment(undefined, undefined, {
      //   url: `/assessment/${assessmentId}`,
      // });
    } catch (error) {}
  };

  useEffect(() => {
    fetchAssessment();
  }, []);

  return (
    <TeachersWrapper
      isPublic={false}
      title="Assessments"
      metaTitle="Olive Grove ~ Create or Modify Assessments"
    >
      <section className="w-full flex flex-col gap-4 items-center h-full">
        <div className="flex justify-between gap-4 w-full">
          {/* Previous page button */}
          <div
            className="w-[30px] h-[30px] border border-greyed hover:border-dark flex items-center justify-center rounded-full "
            onClick={() =>
              router.push(
                `/${
                  role === "teacher"
                    ? "teachers"
                    : role === "student"
                    ? "students"
                    : "admin"
                }/assessments`
              )
            }
          >
            <i className="fas fa-arrow-left text-greyed hover:text-dark"></i>
          </div>
          {/* Preview */}
          {!errorFetchingAssessment && !loadingAssessment && (
            <Button width="fit" className="flex gap-1" size="xs" color="blue">
              <i className="fas fa-eye"></i> <span>Preview</span>
            </Button>
          )}
        </div>
        {loadingAssessment ? (
          <>
            <Loader />
          </>
        ) : errorFetchingAssessment ? (
          <>
            {(errorFetchingAssessment as any).response.status ? (
              <ErrorUI
                status={(errorFetchingAssessment as any).response.status}
                msg={
                  (errorFetchingAssessment as any)?.response?.data?.message ||
                  undefined
                }
              />
            ) : (
              <ErrorUI
                status={500}
                msg={
                  (errorFetchingAssessment as any)?.response?.data?.message ||
                  "Error retrieving assessment"
                }
              />
            )}
          </>
        ) : (
          <Tab
            slugs={[
              { key: "questions", name: "Questions" },
              { key: "responses", name: "Responses" },
            ]}
            body={tab_body}
          />
        )}
      </section>
    </TeachersWrapper>
  );
};

export default withAuth("Teacher", EachAssessment);
