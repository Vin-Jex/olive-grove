import { capitalize } from "@/components/utils/utils";
import React, { FC, ReactNode, useState } from "react";

export type TTabBody = { slug: string; content: ReactNode };

const Tab: FC<{
  slugs: { key: string; name: string }[];
  body: TTabBody[];
}> = ({ slugs, body }) => {
  const [activeTab, setActiveTab] = useState(slugs[0].key);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* TAB ACTIONS */}
      <div className="w-full flex gap-0">
        {slugs.map((slug, i) => (
          <>
            <div
              className={`px-7 py-2 font-medium text-sm cursor-pointer transition ${
                activeTab === slug.key
                  ? "border-primary border-b-2 bg-[#32A8C41A] text-primary"
                  : ""
              }`}
              onClick={() => setActiveTab(slug.key)}
              key={i}
            >
              {capitalize(slug.name)}
            </div>
          </>
        ))}
      </div>
      {/* TAB BODY */}
      <div className="w-full">
        {body.find((content) => content.slug === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tab;
