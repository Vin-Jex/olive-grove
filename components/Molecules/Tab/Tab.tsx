import Cookies from "js-cookie";
import Button from "@/components/Atoms/Button";
import { baseUrl } from "@/components/utils/baseURL";
import {
  TChapter,
  TCourse,
  TLesson,
  TSection,
  TSubSection,
} from "@/components/utils/types";
import { capitalize } from "@/components/utils/utils";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

export type TTabBody = { slug: string; content: ReactNode };

async function fetchCourses(id: string) {
  const jwt = Cookies.get("jwt");
  try {
    const response = await fetch(`${baseUrl}/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwt || "",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to collect IDs of lessons, sections, and subsections in a linear array
function collectLinearContentIds(data: TCourse): string[] {
  const ids: string[] = [];

  // Helper function to traverse chapters, lessons, sections, and subsections
  function traverseItem(item: TChapter) {
    if (item.lessons) {
      // Traverse lessons
      item.lessons.forEach((lesson: TLesson) => {
        lesson._id && ids.push(lesson._id); // Add lesson ID
        lesson.sections.forEach((section: TSection) => {
          section._id && ids.push(section._id); // Add section ID
          section.subsections.forEach((subsection: TSubSection) => {
            subsection._id && ids.push(subsection._id); // Add subsection ID
          });
        });
      });
    }
  }

  // Traverse all data items (chapters)

  data.chapters!.forEach((chapter: TChapter) => {
    traverseItem(chapter);
  });

  return ids;
}

function getPreviousId(currentId: string, linearIds: string[]): string | null {
  const currentIndex = linearIds.indexOf(currentId);
  if (currentIndex > 0) {
    return linearIds[currentIndex - 1]; // Return the ID of the previous item
  }
  return null; // Return null if there's no previous item
}

function getNextId(currentId: string, linearIds: string[]): string | null {
  const currentIndex = linearIds.indexOf(currentId);
  if (currentIndex > 0) {
    return linearIds[currentIndex + 1]; // Return the ID of the previous item
  }
  return null; // Return null if there's no previous item
}

const Tab: FC<{
  slugs: { key: string; name: string }[];
  body: TTabBody[];
  subjectId?: string;
}> = ({ slugs, body, subjectId }) => {
  const [activeTab, setActiveTab] = useState(slugs[0].key);
  const [contentIds, setContentIds] = useState<string[]>([]);
  const router = useRouter();
  const { topic } = router.query;
  const pathName = usePathname();
  const getContentIds = useMemo(() => collectLinearContentIds, []);
  useEffect(() => {
    async function fetchNavigate() {
      if (subjectId) {
        const courses = await fetchCourses(subjectId);
        const contentIds = getContentIds(courses!);
        setContentIds(contentIds);
      }
    }
    fetchNavigate();
  });

  function handlePreviousTab() {
    if (topic) {
      const previousId = getPreviousId(topic as string, contentIds);
      router.push(`${pathName}?topic=${previousId}`);
    }
  }

  function handleNextTab() {
    if (topic) {
      const previousId = getNextId(topic as string, contentIds);
      router.push(`${pathName}?topic=${previousId}`);
    }
  }

  return (
    <div className="min-[1560px]:w-[64rem] flex flex-col gap-6">
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
        <div className="flex w-full justify-between py-5">
          <Button
            onClick={handlePreviousTab}
            size="md"
            className="text-primary !border-primary border"
            color="outline"
            width="fit"
          >
            Previous Topic
          </Button>

          <Button onClick={handleNextTab} size="md" color="blue" width="fit">
            Next Topic
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tab;
