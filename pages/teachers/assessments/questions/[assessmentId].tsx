import React, { useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Tab, { TTabBody } from "@/components/Molecules/Tab/Tab";
import ModifyAssessment from "@/components/Atoms/Assessment/ModifyAssessment";
import AssessmentResponses from "@/components/Atoms/Assessment/AssessmentResponses";

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
  return (
    <TeachersWrapper
      title="Assessments"
      metaTitle="Olive Groove ~ Create or Modify Assessments"
    >
      <Tab
        slugs={[
          { key: "questions", name: "Questions" },
          { key: "responses", name: "Responses" },
        ]}
        body={tab_body}
      />

      <section className="w-full flex items-center "></section>
    </TeachersWrapper>
  );
};

export default withAuth("Teacher", EachAssessment);
