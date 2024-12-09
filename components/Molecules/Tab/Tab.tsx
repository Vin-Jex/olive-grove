import Button from '@/components/Atoms/Button';
import {
  TChapter,
  TCourse,
  TLesson,
  TSection,
  TSubSection,
} from '@/components/utils/types';
import { capitalize } from '@/components/utils/utils';
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,

} from 'react';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import dummyImage from '@/images/dummy-img.jpg';
import Input from '@/components/Atoms/Input';
import { baseUrl } from '@/components/utils/baseURL';
import Cookies from 'js-cookie';
import axiosInstance from '@/components/utils/axiosInstance';

export type TTabBody = { slug: string; content: ReactNode };

async function fetchCourses(id: string) {
  try {
    const response = await axiosInstance(`${baseUrl}/courses/${id}`);
    if (response.status === 200) {
      return response.data;

    }
  } catch (err) {
    console.log(err);
  }
}

// Function to collect IDs of lessons, sections, and subsections in a linear array
type TContentId = { id: string; isViewed: boolean }[];

export function collectLinearContentIds(data: TCourse): TContentId {
  const contentIds = [] as TContentId;

  // Helper function to traverse chapters, lessons, sections, and subsections
  function traverseItem(item: TChapter) {
    if (item.lessons) {
      // Traverse lessons
      item.lessons.forEach((lesson: TLesson) => {
        lesson._id &&
          contentIds.push({ id: lesson._id, isViewed: lesson.viewed! }); // Add lesson ID
        lesson.sections.forEach((section: TSection) => {
          section._id &&
            contentIds.push({ id: section._id, isViewed: section.viewed! }); // Add section ID
          section.subsections.forEach((subsection: TSubSection) => {
            subsection._id &&
              contentIds.push({
                id: subsection._id,
                isViewed: subsection.viewed!,
              }); // Add subsection ID
          });
        });
      });
    }
  }

  // Traverse all data items (chapters)

  data?.chapters?.forEach((chapter: TChapter) => {
    traverseItem(chapter);
  }) ?? [];

  return contentIds;
}

const currentIdIndex = (linearIds: TContentId, currentId: string) => {
  return linearIds.findIndex((content) => content.id === currentId);
};


function getPreviousId(
  currentId: string,
  linearIds: TContentId
): string | null {
  const currentIndex = currentIdIndex(linearIds, currentId);

  if (currentIndex > 0) {
    return linearIds[currentIndex - 1].id; // Return the ID of the previous item
  }
  return null; // Return null if there's no previous item
}

function getNextId(currentId: string, linearIds: TContentId): string | null {
  const currentIndex = currentIdIndex(linearIds, currentId);

  if (currentIndex > 0) {
    return linearIds[currentIndex + 1].id; // Return the ID of the previous item
  }
  return null; // Return null if there's no previous item
}

const Tab: FC<{
  slugs: { key: string; name: string }[];
  body: TTabBody[];
}> = ({ slugs, body }) => {
  const [activeTab, setActiveTab] = useState(slugs[0].key);

  const [contentIds, setContentIds] = useState<TContentId>([]);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [profileImage, setProfileImage] = useState<string | StaticImageData>(
    dummyImage
  );
  const router = useRouter();
  const { topic } = router.query;
  const pathName = usePathname();
  const subjectId = pathName.split('/').pop();
  const getContentIds = useMemo(() => collectLinearContentIds, []);
  useEffect(() => {
    console.log(contentIds, "you can't be an empty array");
  }, [contentIds]);
  useEffect(() => {
    async function fetchNavigate() {
      if (subjectId) {
        const courses = await fetchCourses(subjectId);
        const contentIds = getContentIds(courses.data!);
        console.log(courses, 'gettig the courses');
        console.log(contentIds, 'ids from the source');

        setContentIds(contentIds);
      }
    }
    fetchNavigate();
  }, [subjectId, getContentIds]);

  const fetchProfileImage = useCallback(async () => {
    const userId = Cookies.get('userId');
    try {
      const response = await axiosInstance.get(`${baseUrl}/student`);
      setProfileImage(response.data.profileImage);

    } catch (err) {
      console.error('failed to load student information');
      setProfileImage(dummyImage);
    }
  }, []);

  useEffect(() => {
    fetchProfileImage();
  }, [fetchProfileImage]);

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

  async function handleComment(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/comment`, {
        //endpoint to submit comment
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer accessToken=${Cookies.get(
            'accessToken'
          )};refreshToken=${Cookies.get('refreshToken')}`,
        },
      });

      if (!response.ok) {
        setCommentError('Failed to submit comment');
      }
    } catch (err) {
      console.error(err);
      console.log('sure there is an error???');
      setCommentError('Failed to submit comment');
      //displaying an error if submission failed
    }
    console.log(form);
    console.log('comment submitted');
  }
  // const lastViewPoint = useRef(0);
  // const [viewedSegment, setViewedSegment] = useState<
  //   { start: number; end: number }[]
  // >([]);

  // //* Track the video progress
  // useEffect(() => {
  //   const videoElement = document.querySelector(
  //     '.video-player'
  //   ) as HTMLMediaElement;

  //   if (!videoElement) return;
  //   console.log('yay!! I can find the video element');

  //   function handleTimeUpdate() {
  //     const currentTime = videoElement.currentTime;

  //     setViewedSegment((prev) => {
  //       const segment = [...prev];
  //       const lastSegment = segment[segment.length - 1];
  //       if (lastSegment && lastViewPoint.current === lastSegment.end) {
  //         lastSegment.end = currentTime;
  //       } else {
  //         segment.push({
  //           start: lastViewPoint.current,
  //           end: currentTime,
  //         });
  //       }
  //       return segment;
  //     });
  //     lastViewPoint.current = currentTime;
  //   }

  //   window.addEventListener('timeupdate', handleTimeUpdate);

  //   return () => {
  //     window.removeEventListener('timeupdate', handleTimeUpdate);
  //   };
  // }, []);

  // useEffect(() => {
  //   const videoElement = document.querySelector(
  //     '.video-player'
  //   ) as HTMLMediaElement;

  //   if (!videoElement) return;

  //   function durationWatched() {
  //     if (viewedSegment) {
  //       return viewedSegment.reduce(
  //         (acc, curr) => acc + (curr.end - curr.start),
  //         0
  //       );
  //     }
  //     return 0;
  //   }

  //   const duration = videoElement.duration;
  //   const watchedDuration = durationWatched();
  //   if (watchedDuration >= 0.7 * duration)
  //     console.log(
  //       `${(watchedDuration / duration) * 100}% of the video watched`
  //     );
  //   else console.log('not watched enoug of the video yet');
  // }, [viewedSegment]);

  return (
    <div className='w-full flex flex-col gap-6'>
      {/* TAB ACTIONS */}
      <div className='w-full flex gap-0'>
        {slugs.map((slug, i) => (
          <>
            <div
              className={`px-7 py-2 font-medium text-sm cursor-pointer transition ${
                activeTab === slug.key
                  ? 'border-primary border-b-2 bg-[#32A8C41A] text-primary'
                  : ''
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
      <div className='w-full'>
        {body.find((content) => content.slug === activeTab)?.content}

        <div className='flex w-full justify-between py-5'>
          <Button
            disabled={
              !contentIds[currentIdIndex(contentIds, topic! as string) - 2]
            }
            onClick={handlePreviousTab}
            size='xs'
            className={`disabled:!border-none text-primary !border-primary`}

            color='outline'
            width='fit'
          >
            Previous Topic
          </Button>

          <Button
            disabled={
              !contentIds[currentIdIndex(contentIds, topic! as string) + 1]
            }
            onClick={handleNextTab}
            size='xs'
            color='blue'
            width='fit'
          >
            Next Topic
          </Button>
        </div>
        <div className='border rounded-lg px-5 mb-5'>

          {commentError && (
            <span className='text-red-500 text-sm relative left-[5.4rem]'>
              {commentError}
            </span>
          )}
          <div className=' grid grid-cols-[50px_1fr] py-8 gap-3 items-center w-full'>
            <div className='w-[40px] h-[40px] overflow-hidden'>
              <Image
                src={!profileImage ? dummyImage : profileImage}
                width={40}
                height={40}
                className='w-full h-full rounded-full object-cover'
                alt='student profile'
              />
            </div>
            {/**profile imega */}
            <form
              onSubmit={handleComment}
              className='relative h-fit flex items-center'
            >

              <Input
                name='text'
                className='rounded-full w-full px-3 py-3'
                placeholder='Share your thoughts'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type='submit'
                className='h-full absolute right-2  rounded-full'
              >
                <SendIcon className='w-full h-[calc(100%-0.75rem)]' />

              </button>
            </form>
          </div>
          <div>
            {commentData.map((comment, i) => (
              <DisplayComment comment={comment} i={i} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function DisplayComment({ comment, i }: { comment: TComment; i: number }) {
  const [showReply, setShowReply] = useState(false);
  return (
    <div className='border-b'>
      <CommentCard setShowReply={setShowReply} comment={comment} key={i} />
      <div className='pl-9'>
        {comment.replies &&
          showReply &&
          comment.replies.map((reply, i) => (
            <CommentCard setShowReply={setShowReply} comment={reply} key={i} />
          ))}
      </div>
    </div>
  );
}

type TComment = {
  studentName: string;
  comment: string;
  commentNumber?: number;
  replies?: { studentName: string; comment: string; timeAgo: string }[];
  timeAgo: string;
};

function SendIcon({ className }: { className: string }) {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='30' height='30' rx='15' fill='#32A8C4' fill-opacity='0.1' />
      <g clip-path='url(#clip0_1182_3065)'>
        <path
          d='M21.1759 10.2644C21.4999 9.3682 20.6314 8.4997 19.7352 8.82445L8.78142 12.7859C7.88217 13.1114 7.77342 14.3384 8.60067 14.8177L12.0972 16.8419L15.2194 13.7197C15.3609 13.5831 15.5503 13.5075 15.747 13.5092C15.9436 13.5109 16.1317 13.5898 16.2708 13.7288C16.4098 13.8679 16.4887 14.056 16.4904 14.2526C16.4921 14.4493 16.4165 14.6387 16.2799 14.7802L13.1577 17.9024L15.1827 21.3989C15.6612 22.2262 16.8882 22.1167 17.2137 21.2182L21.1759 10.2644Z'
          fill='#32A8C4'
        />
      </g>
      <defs>
        <clipPath id='clip0_1182_3065'>
          <rect
            width='18'
            height='18'
            fill='white'
            transform='translate(6 6)'
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function CommentCard({
  comment,
  setShowReply,
}: {
  comment: TComment;
  setShowReply: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className='py-5  space-y-7'>
      <div className='grid items-center grid-cols-[40px_1fr] gap-4'>
        <div className='rounded-full  border overflow-hidden  w-[40px] h-[40px]'>
          <Image
            src={dummyImage}
            className=' h-full w-full'
            width={40}
            height={40}
            alt='student profile'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='text-dark font-roboto font-medium text-sm'>
            {comment.studentName}
            <span className=' text-subtext'> • {comment.timeAgo}</span>
          </span>
          <span className='text-subtext text-sm'>{comment.comment}</span>
        </div>
      </div>
      {comment.replies && (
        <button onClick={() => setShowReply((c) => !c)} className='px-5 h-4'>
          <MessageIcon commentNumber={comment.replies.length} />
        </button>
      )}
    </div>
  );
}

function MessageIcon({ commentNumber }: { commentNumber: number }) {
  return (
    <div className='flex h-full items-center'>
      <div className='h-full flex items-center'>
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M2.5 10C2.5 5.85787 5.85787 2.5 10 2.5C14.1422 2.5 17.5 5.85787 17.5 10C17.5 14.1422 14.1422 17.5 10 17.5C8.76033 17.5 7.59087 17.1992 6.56067 16.6667C5.91822 16.3346 3.43407 17.9957 2.91667 17.5C2.40582 17.0107 3.85992 14.3664 3.50337 13.75C2.86523 12.6468 2.5 11.3661 2.5 10Z'
            stroke='#3C413C'
            stroke-opacity='0.8'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M6.66699 11.6667H13.3337'
            stroke='#3C413C'
            stroke-opacity='0.8'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M6.66699 8.33325H13.3337'
            stroke='#3C413C'
            stroke-opacity='0.8'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      </div>
      <div className='leading-3 pl-2 h-full flex items-center'>
        {commentNumber.toLocaleString()}
      </div>

    </div>
  );
}

export default Tab;

const commentData = [
  {
    studentName: 'Pilian Pembape',
    comment: 'Mrs. Elle is the best math teacher everrrs',
    commentNumber: 5,
    replies: [
      {
        studentName: 'Student Name',
        comment: 'Mrs. Elle is the best math teacher everrrs',
        timeAgo: '5h ago',
      },
      {
        studentName: 'Student Name',
        comment: 'Mrs. Elle is the best math teacher everrrs',
        timeAgo: '5h ago',
      },
    ],
    timeAgo: '5h ago',
  },
  {
    studentName: 'Harry Lineker',
    comment: 'Mrs. Elle is the best math teacher everrrs',
    commentNumber: 5,
    replies: [
      {
        studentName: 'Student Name',
        comment: 'Mrs. Elle is the best math teacher everrrs',
        timeAgo: '5h ago',
      },
      {
        studentName: 'Student Name',
        comment: 'Mrs. Elle is the best math teacher everrrs',
        timeAgo: '5h ago',
      },
    ],
    timeAgo: '5h ago',
  },
  {
    studentName: 'Manchester united',
    comment: 'Mrs. Elle is the best math teacher everrrs',
    commentNumber: 5,
    replies: [
      {
        studentName: 'Mary Ann',
        comment: 'Mrs. Elle is the best math teacher everrrs',
        timeAgo: '5h ago',
      },
      {
        studentName: 'Student Name',
        comment: 'Mrs. Elle is the best math teacher everrrs',
        timeAgo: '5h ago',
      },
    ],
    timeAgo: '5h ago',
  },
  {
    studentName: 'Student Name',
    comment: 'Mrs. Elle is the best math teacher everrrs',
    commentNumber: 5,
    timeAgo: '5h ago',
  },
];
