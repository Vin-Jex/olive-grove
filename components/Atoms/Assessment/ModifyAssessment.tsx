import React from "react";
import AssessmentTitleHeader from "./TitleHeader";
import AssessmentQuestion from "./AssessmentQuestion";

const ModifyAssessment = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Assessment Header */}
      <AssessmentTitleHeader title={"Physics Class"}>
        The questions below are made up of 4 options, choose 1 from the 4
        options for each of the questions and click submit when you are done.
      </AssessmentTitleHeader>
      <div className="w-full flex flex-col gap-6">
        {[1, 2, 3].map((_) => (
          <AssessmentQuestion key={_} question_id={_.toString()} />
        ))}
      </div>
    </div>
  );
};

export default ModifyAssessment;
