import { TCourseModalFormData } from '@/components/utils/types';
import { TCourse, TResponse } from '@/components/utils/types';
import { useCourseContext } from '@/contexts/CourseContext';
import { FC } from 'react';
import Wrapper from './CourseWrapper';
import { baseUrl } from '@/components/utils/baseURL';
import axiosInstance from '@/components/utils/axiosInstance';

const Add: FC<{
  type: 'chapter' | 'lesson' | 'topic' | 'subsection';
  parentId: string;
}> = ({ type, parentId }) => {
  const { dispatch, openModal, setModalRequestState } = useCourseContext();

  /**
   * * Function responsible for creating a new chapter/lesson/topic - Making the API request to the endpoint required to create any of the items
   * @returns void
   */
  const createNew = async (formState: TCourseModalFormData) => {
    try {
      // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
      setModalRequestState({
        data: undefined,
        loading: true,
        error: undefined,
      });

      // * Get the access token from the cookies
      // * If the type is an object
      const req_body = ['topic', 'lesson', 'subsection'].includes(type)
        ? new FormData()
        : JSON.stringify({
            ...formState,
            // availableDate: new Date().toISOString(),
          });

      if (
        ['topic', 'lesson', 'subsection'].includes(type) &&
        typeof req_body === 'object'
      ) {
        const entries = Object.entries(formState);

        for (const [key, value] of entries) {
          if (
            key === 'topicVideo' &&
            (typeof formState[key] === 'string' || !formState[key])
          )
            continue;

          req_body.append(key, value as string);
        }
        console.log(entries, 'req_body');

        // if (!formState.topicVideo) {
        //   req_body.append("topicVideo", null as any);
        // }
        // if (!formState.topicImage) {
        //   req_body.append("topicImage", null as any);
        // }
        // req_body.append("availableDate", new Date().toISOString());
      }

      // * Make an API request to create this item
      const response = await axiosInstance.post(
        `${baseUrl}/courses/${
          type === 'chapter'
            ? 'chapters'
            : type === 'lesson'
            ? 'lessons'
            : type === 'topic'
            ? 'section'
            : type === 'subsection'
            ? 'subsection'
            : ''
        }/${parentId}`,
        req_body,
        {
          headers: {
            ...(['topic', 'lesson', 'subsection'].includes(type)
              ? { 'Content-Type': 'multipart/form-data' }
              : { 'Content-Type': 'application/json' }),
          },
        }
      );

      // * Update the existing data with that returned by the API request
      const responseData = response.data as TResponse<TCourse>;
      setModalRequestState({
        data: responseData.data,
        loading: false,
        error: undefined,
      });

      // * Add a new item (chapter/lesson/topic) with the details of the newly created item to the Course reducer
      dispatch({
        type:
          type === 'chapter'
            ? 'CREATE_CHAPTER'
            : type === 'lesson'
            ? 'CREATE_LESSON'
            : type === 'topic'
            ? 'CREATE_TOPIC'
            : type === 'subsection'
            ? 'CREATE_SUBSECTION'
            : 'CREATE_CHAPTER',
        payload: {
          parentId: parentId,
          title: responseData.data.title,
          description: responseData.data.description,
          topicNote: responseData.data?.topicNote,
          topicVideo: responseData.data?.topicVideo,
          youtubeVideo: responseData.data?.youtubeVideo,
          embed: responseData.data?.embed,
          _id: responseData.data._id,
        },
      });

      return true;
    } catch (error: any) {
      console.error(error);
      // * If it's a 400 error, display message that the input details are incomplete
      if (error?.response?.status == 400) {
        const data = error?.response?.data as TResponse<any>;
        setModalRequestState({
          data: undefined,
          loading: false,
          error: data.message,
        });
        return false;
      }

      // * If it's any other error code, display default error msg
      setModalRequestState({
        data: undefined,
        loading: false,
        error: `An error occurred while creating the ${type}`,
      });

      console.error('Returned false');
      return false;
    }
  };

  /**
   * * Function responsible for opening the modal
   */
  const onAdd = () => {
    openModal({
      modalMetadata: {
        formData: {
          title: '',
          description: '',
          topicNote: '',
        },
        mode: 'create',
        type: type,
        handleAction: createNew,
      },
    });
  };

  if (type === 'topic') {
    return (
      <span
        className='text-greyed flex items-center gap-2 -ml-1 cursor-pointer transition hover:text-primary'
        onClick={onAdd}
      >
        <i className='fas fa-plus'></i>{' '}
        <span className='underline '>Add new {type}</span>{' '}
      </span>
    );
  }

  if (type === 'subsection') {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
          // openEditCourseModal();
        }}
        className='flex items-center gap-2  hover:bg-black/10  w-full py-2 pl-3 rounded-tr-lg rounded-tl-lg'
      >
        <i className='fas fa-plus'></i>{' '}
        <div className='text-sm'>Add Subtopic</div>
      </button>
    );
  }

  return (
    <>
      <Wrapper type='add' onAdd={onAdd}>
        <span className='text-greyed'>Add new {type}</span>
      </Wrapper>
    </>
  );
};

export default Add;
