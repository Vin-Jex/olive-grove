import StudentWrapper from '@/components/Molecules/Layouts/Student.Layout';
import React, { useCallback, useEffect, useState } from 'react';
import SubjectCard from '@/components/Molecules/Card/SubjectCard';
import Link from 'next/link';
import withAuth from '@/components/Molecules/WithAuth';
import { TFetchState } from '@/components/utils/types';
import dummyImage from '@/public/image/dummy-img.jpg';
import DepartmentModal from '@/components/Molecules/Modal/DepartmentModal';
import { baseUrl } from '@/components/utils/baseURL';
import axiosInstance from '@/components/utils/axiosInstance';
import { AxiosError } from 'axios';
import { handleLogout } from '@/components/Molecules/Layouts/Admin.Layout';
import { useRouter } from 'next/router';
import SearchLayout from '@/components/Molecules/SearchLayout';
import Select from '@/components/Atoms/Select';
import Image from 'next/image';
import useDebounce from '@/components/utils/useDebounce';
import Loader from '@/components/Atoms/Loader';

type TCourse = {
  _id: string;
  title: string;
  courseCover: string;
  teacher: {
    name: string;
    profileImage: string;
  };
  startDate: string;
  description: string;
  classId: {
    description: string;
  };
};

const Lectures = () => {
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
  // const router = useRouter();
  const [searched, setSearched] = useState('');

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

      console.log(courses, 'courses');

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
        handleLogout('students');
      }
      setCourses({ data: [], loading: false, error: 'No courses found' });
    }
  }, []);

  const getFilteredCourses = useCallback(async () => {
    // const searched = router.query.search as string;
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
  }, [searched]);

  // Separate effects for different concerns
  useEffect(() => {
    getCourses();
  }, [getCourses]);

  // const patToUrl = useCallback(
  //   (searchValue: string) => {
  //     const pathName = router.pathname;
  //     const query = searchValue ? `?search=${searchValue}` : '';
  //     router.push(`${pathName}${query}`);
  //   },
  //   [router]
  // );

  // const debouncedSearch = useDebounce(getFilteredCourses, 500);
  const debouncedGetFilteredCourses = useDebounce(getFilteredCourses, 500);

  function handleModal() {
    setLectureInfoModal(!lectureInfoModal);
  }

  useEffect(() => {
    if (searched && searched.length > 0) {
      debouncedGetFilteredCourses();
    }

    if (searched.length === 0) {
      setFilteredCourses({ data: [], loading: false, error: undefined });
    }
  }, [searched, debouncedGetFilteredCourses]);

  return (
    <>
      <DepartmentModal
        type='lecture'
        handleModalClose={handleModal}
        modalOpen={lectureInfoModal!}
      />
      <StudentWrapper
        title='Olive Grove - Lectures'
        remark='Manage and get updates on your courses'
        metaTitle='Olive Grove - Lectures'
      >
        <div className='flex flex-col space-y-8'>
          <div className='flex items-center max-sm:gap-5 justify-between'>
            <div className='relative'>
              <SearchLayout value={searched as string} onChange={setSearched} />
              <div
                className={`flex flex-col gap-1 w-[20rem] absolute bg-white  z-20 ${
                  filteredCourses.data.length > 0 &&
                  'border border-b border-r border-t-0 border-l rounded-br-md rounded-bl-md'
                }`}
              >
                {filteredCourses.data.length > 0 &&
                  searched.length > 0 &&
                  filteredCourses.data.map((subject, index) => (
                    <Link
                      href={`/students/lectures/${subject._id}`}
                      key={index}
                    >
                      <div className='flex items-center px-3 py-4 gap-5  left-0 w-full h-10'>
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
                          {subject.title.slice(0, 20) ||
                            'no description available'}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
            <Select
              name=''
              className='max-w-[120px] max-sm:max-w-[180px]'
              inputSize='sm'
              onChange={() => {}}
              options={['ascending', 'latest']}
              placeholder='filter'
              value=''
              required
            />
          </div>
          {courses.loading ? (
            <div className='h-[calc(100vh-20rem)]'>
              <Loader />
            </div>
          ) : (
            <div className='grid max-md:place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-fit w-full gap-3 !mt-8'>
              {courses.data.map((subject) => (
                <SubjectCard
                  teacherImage={subject.teacher.profileImage}
                  key={subject._id}
                  name={subject.teacher.name}
                  role={'Teacher'}
                  time={subject.startDate}
                  description={subject.description}
                  topic={subject.title as string}
                  subject={subject.title}
                  toggleModal={handleModal}
                  btnLink2={`/students/lectures/${subject._id}`}
                />
              ))}
            </div>
          )}
        </div>
      </StudentWrapper>
    </>
  );
};

export default withAuth('Student', Lectures);
