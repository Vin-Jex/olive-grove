import React, { ChangeEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import Button, { ButtonProps } from '@/components/Atoms/Button';
import TextEditor from '@/components/Atoms/TextEditor';
import File from '@/components/Atoms/File';
import { capitalize, formatDateToISO } from '@/components/utils/utils';
import { TCourse, TCourseModalProps } from '@/components/utils/types';
import { CircularProgress } from '@mui/material';
import InputField from '@/components/Atoms/InputField';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export default function CourseModal({
  modalOpen,
  handleModalClose,
  handleAction,
  handleDelete,
  type,
  formState,
  setFormState,
  requestState,
  mode,
  departments,
}: TCourseModalProps) {
  const [selectedImage, setSelectedImage] = useState<
    Blob | null | string | undefined
  >(null);
  const [fileName, setFileName] = useState('');
  const [topicVideoType, setTopicVideoType] = useState<
    'topicVideo' | 'youtubeVideo' | 'embed'
  >(
    formState.topicVideo
      ? 'topicVideo'
      : formState.youtubeVideo
      ? 'youtubeVideo'
      : 'embed'
  );
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [is_loading, setIsLoading] = useState({
    saving: false,
    deleting: false,
  });
  const [topicYouTubeUrl, setTopicYouTubeUrl] = useState(
    formState.youtubeVideo
  );

  const textEditorValue = ['topic', 'lesson', 'subsection'].includes(type)
    ? 'topicNote'
    : type === 'course'
    ? 'description'
    : '';

  const resetImageField = () => {
    setSelectedImage(null);
    setFileName('');
    setPreviewImage(null);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, files },
    } = event;
    const file = files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
      // * Update the course cover image or topic video form state
      setFormState((prevState: any) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setSelectedImage(null);
    }
  };

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setFormState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const modifyYouTubeLink: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    const updateYTURL = (ytEmbedURL: string) => {
      // * Update the youtube video with the correct embed URL
      handleChange({
        target: { name: 'youtubeVideo', value: ytEmbedURL || '' },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    try {
      setTopicYouTubeUrl(value);

      const ytVideoId = new URL(value).searchParams.get('v');

      // * If the user added the embed url direcly
      if (value.includes('/embed/')) {
        // * Update the youtube video with the entered URL
        updateYTURL(value);
        return;
      }

      const ytEmbedURL = `https://www.youtube.com/embed/${ytVideoId}`;

      // * Update the youtube video with the correct embed URL
      updateYTURL(ytEmbedURL);
    } catch (error: AxiosError | any) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          'An error occured'
      );
      console.log('Error', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading({ saving: true, deleting: false });
    if (formState.isActive === 'true') {
      setFormState((prevState: any) => ({
        ...prevState,
        isActive: true,
      }));
    } else {
      setFormState((prevState: any) => ({
        ...prevState,
        isActive: false,
      }));
    }

    console.log(formState, 'formState');

    const result = handleAction && (await handleAction(formState));
    if (result) {
      handleModalClose();
      toast.success(`${type} ${mode}d successfully`);
    }

    setIsLoading({ saving: false, deleting: false });
  };

  const deleteActionProps: Omit<ButtonProps, 'children'> = {
    onClick: async (e) => {
      // * Prevent's the page from getting reloaded on submit
      e.preventDefault();
      // * Display the deleting loading state
      setIsLoading({ saving: false, deleting: true });
      /// * Make the request to handle the form submission
      const result = handleDelete && (await handleDelete(formState));
      // * If the request was completed successfully, close the modal
      if (result) handleModalClose();
      // * Remove the deleting loading state
      setIsLoading({ saving: false, deleting: false });
    },
    disabled: requestState?.loading || false,
  };

  useEffect(() => {
    setPreviewImage((formState as TCourse).courseCover as string);
  }, [formState]);

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:w-[600px] bg-white backdrop-blur-[10px] rounded-3xl'
      >
        <div className='flex justify-between items-center px-4 mt-[1.1rem]'>
          <span className='text-xl text-dark font-semibold font-roboto capitalize'>
            {capitalize(mode)} {capitalize(type)}
          </span>
        </div>
        <form
          className='flex flex-col justify-center py-4 my-2 px-4 w-full space-y-6'
          onSubmit={handleFormSubmit}
        >
          {/* {requestState?.error && (
            <>
              <div className='text-red-500 text-center'>
                <Info sx={{ fontSize: '1.1rem' }} className='mt-0.5' />
                {typeof requestState?.error === 'string' &&
                  (requestState.error as string)}
              </div>
            </>
          )} */}

          {type === 'course' && (
            // <Select
            //   name='classId'
            //   options={departments || []}
            //   required
            //   placeholder='Select class'
            //   onChange={handleChange}
            //   {...(formState.department ? { value: formState.department } : {})}
            // />
            <InputField
              label={`Assign Department`}
              options={departments}
              placeholder='Select Department'
              type='select'
              required
              name='department'
              value={formState.department}
              onChange={handleChange}
              error={''}
            />
          )}

          <InputField
            label={`${capitalize(type)} Title`}
            placeholder={`${capitalize(type)} Title`}
            type='text'
            name='title'
            required
            value={formState.title}
            onChange={handleChange}
            error={''}
          />
          {type === 'course' && (
            <>
              <InputField
                error=''
                type='datetime-local'
                name='startDate'
                value={formatDateToISO(formState.startDate)}
                label={`Course Start Date`}
                onChange={handleChange}
                className='input'
                required={true}
              />
              <InputField
                error=''
                type='datetime-local'
                name='endDate'
                label={`Course End Date`}
                value={formatDateToISO(formState.endDate)}
                onChange={handleChange}
                className='input'
                required={true}
              />
            </>
          )}
          <InputField
            onChange={handleChange}
            placeholder='Choose accessibility status'
            label='Accessibility Status'
            value={String(formState.isActive) as string}
            error=''
            required
            type='select'
            name='isActive'
            options={[
              { display_value: 'Yes', value: 'true' },
              { display_value: 'No', value: 'false' },
            ]}
          />

          {['topic', 'lesson', 'subsection'].includes(type) && (
            <TextEditor
              value={(formState as any)[textEditorValue]}
              placeholder={`${capitalize(type)} ${
                ['topic', 'lesson', 'subsection'].includes(type)
                  ? 'Notes'
                  : type === 'course'
                  ? 'Description'
                  : ''
              }`}
              onChange={(e: any) => {
                setFormState((prevState: any) => ({
                  ...prevState,
                  [textEditorValue]: e,
                }));
              }}
            />
          )}

          {/* If the modal is that for creating or editing a course */}

          {type === 'course' && (
            <InputField
              label={`${capitalize(type)} Description`}
              placeholder={`${capitalize(type)} Description`}
              type='textarea'
              required
              name='description'
              value={formState.description} // i am not sure of the formstate for descriptoin
              onChange={handleChange}
              error={''}
            />
          )}

          {/* {(type === "topic" || type === "course") && (
            <File
              selectedImage={selectedImage}
              name={type === "topic" ? "topicVideo" : "courseCover"}
              setSelectedImage={setSelectedImage}
              previewImage={previewImage}
              onChange={handleImageChange}
              disabled={false}
              resetImageStates={resetImageField}
              placeholder={
                fileName !== ""
                  ? fileName
                  : type === "topic"
                  ? "Upload Video"
                  : "Upload course image"
              }
              required
              fileName={fileName}
            />
          )} */}

          {['topic', 'lesson', 'subsection'].includes(type) && (
            <div className='flex flex-col gap-4'>
              <InputField
                label={`${capitalize(type)} Available Date`}
                placeholder={`Enter the date the ${type} will be available`}
                type='datetime-local'
                name='availableDate'
                value={formatDateToISO(formState.availableDate)}
                onChange={handleChange}
                required
                error={''}
              />

              <InputField
                label={`Select Upload Type`}
                placeholder={`Choose Type`}
                type='select'
                name='topicVideoType'
                value={topicVideoType}
                onChange={(e) => setTopicVideoType(e.target.value as any)}
                options={[
                  { display_value: 'Upload Video', value: 'topicVideo' },
                  { display_value: 'YouTube Video URL', value: 'youtubeVideo' },
                  { display_value: 'Embeded Site URL', value: 'embed' },
                ]}
                required
                error={''}
              />

              {topicVideoType === 'topicVideo' ? (
                <File
                  fileType='video'
                  selectedImage={selectedImage}
                  name={'topicVideo'}
                  setSelectedImage={setSelectedImage}
                  previewImage={previewImage}
                  onChange={handleImageChange}
                  disabled={false}
                  resetImageStates={resetImageField}
                  placeholder={fileName !== '' ? fileName : 'Upload Video'}
                  fileName={fileName}
                />
              ) : topicVideoType === 'youtubeVideo' ? (
                <div className='flex w-full flex-col space-y-4 text-subtext'>
                  <InputField
                    label={`YouTube URL`}
                    placeholder={`Enter YouTube URL`}
                    type='url'
                    name='youtubeVideo'
                    value={topicYouTubeUrl}
                    onChange={(e) => modifyYouTubeLink(e as any)}
                    error={''}
                  />
                  <div className='bg-primary/10 rounded-lg p-4'>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Here's the YouTube Embed URL that will be used:{' '}
                    {formState.youtubeVideo}
                  </div>
                </div>
              ) : (
                <div className='flex w-full flex-col gap-2 text-subtext'>
                  <InputField
                    label={`Website URL For Embedding`}
                    placeholder={`Enter Website URL`}
                    type='url'
                    name='embed'
                    value={formState.embed}
                    onChange={handleChange}
                    error={''}
                  />
                  <div className='bg-primary/10 rounded-lg p-4'>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Here's the Website URL that will be used: {formState.embed}
                  </div>
                </div>
              )}
            </div>
          )}

          {type === 'course' && (
            <File
              selectedImage={selectedImage}
              accept='image/png, image/jpeg, image/jpg'
              name={'courseCover'}
              setSelectedImage={setSelectedImage}
              previewImage={previewImage}
              onChange={handleImageChange}
              disabled={false}
              resetImageStates={resetImageField}
              placeholder={fileName !== '' ? fileName : 'Upload course image'}
              fileName={fileName}
            />
          )}

          <div className='flex items-center justify-between space-x-5 w-full'>
            <Button
              size='xs'
              width='fit'
              className='!px-6'
              type='submit'
              color='outline'
              disabled={
                requestState?.loading ||
                formState.department === '' ||
                formState.endDate === '' ||
                formState.startDate === '' ||
                is_loading.saving
              }
              //
            >
              {is_loading.saving ? (
                <CircularProgress size={15} color='inherit' />
              ) : (
                'Save'
              )}
            </Button>

            {/* {mode === 'edit' && handleDelete && (

              <Button
                size='xs'
                width='fit'
                className='!px-6'
                color='red'
                {...deleteActionProps}
              >
                {is_loading.deleting ? (
                  <CircularProgress size={15} color='inherit' />
                ) : (
                  "Delete"
                )}
              </Button>
            )} */}
          </div>
        </form>
      </Modal>
    </div>
  );
}
