import React, { useState } from 'react';
import Modal from './Modal';
import Button from '@/components/Atoms/Button';
import axiosInstance from '@/components/utils/axiosInstance';
import { baseUrl } from '@/components/utils/baseURL';
import { Alert, Snackbar } from '@mui/material';
import OTPInput from '../OTPInput';
import { BarLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import useUserVerify from '@/components/utils/hooks/useUserVerify';

type WarningModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
};

export default function EmailVerifyModal({
  modalOpen,
  handleModalClose,
}: WarningModalProps) {
  // const [response, setResponse] = useState('');
  // const [request, setRequest] = useState(false);
  const [OTPVerifyLoading, setOTPVerifyLoading] = useState(false);
  const {
    otpRequestLoading,
    handleRequestOTP,
    message,
    setMessage,
    verifyOTP,
    OTPTimer,
  } = useUserVerify();
  const [otp, setOtp] = useState('');
  const router = useRouter();

  async function handleEmailVerify(otp: string) {
    console.log('Verify OTP');
    try {
      setOTPVerifyLoading(true);
      const request_body = JSON.stringify({ otp });
      const response = await axiosInstance.post(
        `${baseUrl}/email/verify`,
        request_body
      );
      setMessage({
        success: true,
        error: false,
        message: response.data.message,
      });
      handleModalClose();
      router.replace(router.asPath);
    } catch (err) {
      console.error('otp error', otp);
    } finally {
      setOTPVerifyLoading(false);
    }
  }
  return (
    <div>
      <Modal
        type='verify_email'
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:w-[602px] bg-white backdrop-blur-[10px] rounded-3xl'
      >
        <div className='flex flex-col items-center justify-center py-5 md:py-[40px] px-4 md:px-6 w-full gap-y-6 md:gap-y-6'>
          <div className='text-center text-lg'>Verify your email</div>

          <span className='text-center text-gray-500'>
            On clicking the &apos;verify email&apos; buttton you would be sent a
            verification code to your email address. Get the code and come back
            to fill in the blow input field.
          </span>
          <div className='flex items-center justify-center gap-5 sm:gap-6 w-full'>
            <Button
              size='sm'
              onClick={(e) => {
                e.preventDefault();
                handleRequestOTP('email_verification');
              }}
            >
              {otpRequestLoading ? <BarLoader /> : 'Verify Email'}
            </Button>
          </div>
          <div>
            <OTPInput length={6} onChange={setOtp} />
            <div className='mx-auto flex items-center gap-4'>
              <Button
                size='sm'
                onClick={(e) => {
                  e.preventDefault();
                  handleEmailVerify(otp);
                  // handleModalClose();
                }}
              >
                {OTPVerifyLoading ? (
                  <BarLoader className='text-white' />
                ) : (
                  'send OTP'
                )}
              </Button>
              {OTPTimer > 0 && <span className='text-subtext'>{OTPTimer}</span>}
            </div>
          </div>
        </div>
      </Modal>
      {(message.error || message.success) && (
        <Snackbar
          open={message.success || message.error}
          onClose={() =>
            setMessage((err) => ({
              ...err,
              error: false,
              success: false,
            }))
          }
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          className='!z-[999]'
        >
          <Alert
            severity={message.error ? 'error' : 'success'}
            onClose={() =>
              // setMessage((err) => ({ ...err, error: false }))
              setMessage((err) => ({
                ...err,
                error: false,
                success: false,
              }))
            }
          >
            {message.message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}
