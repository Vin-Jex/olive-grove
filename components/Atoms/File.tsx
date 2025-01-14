import Image from 'next/image';
import React, { ChangeEvent, useRef } from 'react';
import { IImageUploadProps } from '../utils/types';

const File: React.FC<IImageUploadProps> = ({
  placeholder,
  type,
  onChange,
  selectedImage,
  fileType,
  setSelectedImage,
  fileName,
  previewImage,
  resetImageStates,
  ...inputProps
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    resetImageStates();
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <button type='button' className=''>
      <label
        className='flex items-center gap-2 md:gap-4 cursor-pointer'
        onClick={handleDivClick}
      >
        <div className='flex items-center justify-center w-[30px] h-[30px] sm:w-[45px] sm:h-[45px] border-[1.5px] border-[#1E1E1E60] rounded-md'>
          {previewImage ? (
            fileType === 'video' ? (
              <video className='w-full h-full'>
                <source src={previewImage as string} type='video/mp4' />
              </video>
            ) : (
              <Image
                src={previewImage as string}
                alt='Preview'
                width='10000'
                height='10000'
                className='w-full h-full object-scale-down bg-gray-300'
              />
            )
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.98 3.195 4.45067 2.99934 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM5 19H19V5H5V19ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z'
                fill='#1E1E1E'
                fillOpacity='0.4'
              />
            </svg>
          )}
        </div>
        <span className='font-normal font-roboto text-[16px] sm:text-[17px] my-auto text-[#1E1E1E60] whitespace-nowrap'>
          {fileName === '' ? placeholder || `Upload Profile Picture` : fileName}
        </span>
      </label>
      <input
        ref={fileInputRef}
        type={type || 'file'}
        onChange={handleImageChange}
        style={{ display: 'none' }}
        {...inputProps}
      />
    </button>
  );
};

export default File;
