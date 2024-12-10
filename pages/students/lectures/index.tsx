import Cookies from 'js-cookie';
import StudentWrapper from '@/components/Molecules/Layouts/Student.Layout';
import React, { useCallback, useEffect, useState } from 'react';
import SubjectCard from '@/components/Molecules/Card/SubjectCard';
import Link from 'next/link';
import withAuth from '@/components/Molecules/WithAuth';
import { TFetchState } from '@/components/utils/types';
// import { fetchCourses } from "@/components/utils/course";
import dummyImage from '@/images/dummy-img.jpg';
import ClassModal from '@/components/Molecules/Modal/ClassModal';
import { baseUrl } from '@/components/utils/baseURL';
import axiosInstance from '@/components/utils/axiosInstance';
import { AxiosError } from 'axios';
import { handleLogout } from '@/components/Molecules/Layouts/Admin.Layout';
import { useRouter } from 'next/router';
import SearchLayout from '@/components/Molecules/SearchLayout';
import Select from '@/components/Atoms/Select';
import Image from 'next/image';
import useDebounce from '@/components/utils/useDebounce';

export const subjectData = [
  {
    subject: 'Further Mathematics',
    role: 'Teacher',
    time: '09:00AM - 10:30AM',
    topic: 'Calculus',
    name: 'Dr. Ayodeji Emmanuel',
    btnLink1: '#',
  },
  {
    subject: 'Chemistry',
    role: 'Teacher',
    time: '09:00AM - 10:30AM',
    topic: 'Organic Chemistry',
    name: 'Dr. Ayodeji Emmanuel',
    btnLink1: '#',
  },
  {
    subject: 'Physics',
    role: 'Teacher',
    time: '09:00AM - 10:30AM',
    topic: 'Motion',
    name: 'Dr. Ayodeji Emmanuel',
    btnLink1: '#',
  },
  {
    subject: 'Mathematics',
    role: 'Teacher',
    time: '09:00AM - 10:30AM',
    topic: 'Trigonomentry',
    name: 'Dr. Ayodeji Emmanuel',
    btnLink1: '#',
  },
];

type TCourse = {
  _id: string;
  title: string;
  courseCover: string;
  description: string;
  classId: {
    description: string;
  };
};

const Classes = () => {
  const [courses, setCourses] = useState<TFetchState<TCourse[]>>({
    data: [],
    loading: false,
    error: undefined,
  });
  const [filteredCourses, setFilteredCourses] = useState<
    TFetchState<TCourse[]>
  >({
    data: [],
    loading: false,
    error: undefined,
  });
  const [lectureInfoModal, setLectureInfoModal] = useState(false);
  const router = useRouter();
  const [searched, setSearched] = useState(router.query.search ?? '');
  useEffect(() => {
    setSearched(router.query.search ?? '');
  }, [router.query.search]);

  //  courses;
  const getCourses = useCallback(async () => {
    setCourses({
      data: [],
      loading: true,
      error: undefined,
    });

    try {
      const { data: courses }: { data: { data: TCourse[] } } =
        await axiosInstance.get(`${baseUrl}/courses`);

      if (Array.isArray(courses.data)) {
        setCourses({
          data: courses.data,
          loading: false,
          error: undefined,
        });
      } else {
        setCourses({
          data: [],
          loading: false,
          error: 'Wrong course data format',
        });
      }
    } catch (error: AxiosError | any) {
      if (error.response && error.response.status === 401) {
        handleLogout().then(() => router.push('/auth/path/students/login/'));
      }
      setCourses({ data: [], loading: false, error: 'No courses found' });
    }
  }, []); // Empty dependency array

  const getFilteredCourses = useCallback(async () => {
    const searched = router.query.search as string;
    if (!searched || searched.trim().length === 0) return;

    try {
      const { data: filteredCourses } = await axiosInstance.get(
        `${baseUrl}/courses?title=${searched}`
      );

      if (filteredCourses.data.length > 0) {
        setFilteredCourses({
          data: filteredCourses.data,
          loading: false,
          error: undefined,
        });
      } else {
        setFilteredCourses({
          data: [],
          loading: false,
          error: 'No filtered courses found',
        });
      }
    } catch (error) {
      setFilteredCourses({
        data: [],
        loading: false,
        error: 'Error fetching filtered courses',
      });
    }
  }, [router.query.search]);

  // Separate effects for different concerns
  useEffect(() => {
    getCourses();
  }, []); // Only run once when component mounts

  const patToUrl = useCallback(
    (searchValue: string) => {
      const pathName = router.pathname;
      const query = searchValue ? `?search=${searchValue}` : '';
      router.push(`${pathName}${query}`);
    },
    [router]
  );

  const debouncedSearch = useDebounce(patToUrl, 500);
  const debouncedGetFilteredCourses = useDebounce(getFilteredCourses, 500);

  function handleModal() {
    setLectureInfoModal(!lectureInfoModal);
  }

  useEffect(() => {
    if (searched && searched.length > 0) {
      debouncedSearch(searched as string);
    }
    console.log('this effect can"t just keep running infinitely, can it?');
    console.log(searched, 'this is searched');

    if (searched.length === 0) {
      router.push(router.pathname);
      setFilteredCourses({ data: [], loading: false, error: undefined });
    }
  }, [searched]);

  useEffect(() => {
    debouncedGetFilteredCourses();
  }, [router.query.search, debouncedGetFilteredCourses]);
  return (
    <>
      <ClassModal
        type='class'
        handleModalClose={handleModal}
        modalOpen={lectureInfoModal!}
      />
      <StudentWrapper
        title='Courses'
        firstTitle='Courses'
        remark='Manage and get updates on your courses'
        metaTitle='Olive Groove ~ Classes'
      >
        <div className='p-12 space-y-5'>
          {/* Title */}
          {/* <div className='flex flex-col'>
            <span className='text-lg lg:text-3xl font-medium text-dark font-roboto'>
              Explore your classes
            </span>
            <span className='text-md text-subtext font-roboto'>
              Manage and join your classes.
            </span>
          </div> */}
          <div className='flex items-center justify-between'>
            <div className='relative'>
              <SearchLayout value={searched as string} onChange={setSearched} />
              <div className=' w-[20rem] bg-white border-b border-r border-l rounded-br-md rounded-bl-md  z-20'>
                {filteredCourses.loading && <p>Loading...</p>}
                {filteredCourses.error && (
                  <p className='h-8 absolute'>
                    Failed to fetch searched courses
                  </p>
                )}
                {/**border-b border-r border-l rounded-br-md rounded-bl-md */}
                <div className='flex flex-col gap-1 w-[20rem] absolute bg-white  border z-20'>
                  {filteredCourses.data.length > 0 &&
                    searched.length > 0 &&
                    filteredCourses.data.map((subject, index) => (
                      <div
                        className='flex items-center px-3 py-3 gap-5  left-0 w-full h-8'
                        key={index}
                      >
                        <div className='w-[26px] h-[26px] overflow-hidden rounded-full'>
                          <Image
                            width={300}
                            height={300}
                            className='h-full w-full object-cover'
                            src={(subject.courseCover as string) || dummyImage}
                            alt={subject.description || 'course searched'}
                          />
                        </div>
                        <div className=' flex-shrink-0'>
                          {subject?.classId?.description?.slice(0, 20) ||
                            'no description available'}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <Select
              name=''
              reduceWidth
              onChange={() => {}}
              options={['cowboy', 'mallen']}
              placeholder='filter'
              value=''
              required
            />
          </div>

          <div className='grid max-md:place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-fit w-full gap-3 !mt-8'>
            {courses.data.map((subject, index) => (
              <SubjectCard
                key={subject._id}
                name={'No Teacher Name'}
                role={'Teacher'}
                // type="lecture"
                time={'time'}
                topic={subject.title as string}
                subject={subject.title}
                toggleModal={handleModal}
                btnLink2={`/students/lectures/${subject._id}`}
              />
            ))}
          </div>
        </div>
      </StudentWrapper>
    </>
  );
};
// export default Classes;

export default withAuth('Student', Classes);
