import React, { FC, ReactNode } from "react";

const AssessmentTitleHeader: FC<{ title: ReactNode; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-primary/10 p-4">
      <div className="font-bold text-3xl">{title}</div>
      <div className="text-greyed text-lg">{children}</div>
    </div>
  );
};

export default AssessmentTitleHeader;
