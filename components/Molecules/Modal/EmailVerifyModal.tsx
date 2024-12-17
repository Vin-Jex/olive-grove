import React, { useState } from 'react';
import Modal from './Modal';
import Button from '@/components/Atoms/Button';
import Input from '@/components/Atoms/Input';
import axiosInstance from '@/components/utils/axiosInstance';
import { baseUrl } from '@/components/utils/baseURL';
import { Alert, Snackbar } from '@mui/material';
import OTPInput from '../OTPInput';

type WarningModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
};

export default function EmailVerifyModal({
  modalOpen,
  handleModalClose,
}: WarningModalProps) {
  const [response, setResponse] = useState('');
  const [request, setRequest] = useState(false);
  const [otp, setOtp] = useState('');

  async function handleVerify() {
    console.log('Verify email');
    try {
      const request_body = JSON.stringify({ type: 'email_verification' });
      const response = await axiosInstance.post(
        `${baseUrl}/otp/request`,
        request_body
      );
      setResponse(response.data.message);
      setRequest(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleOTPVefify(otp: string) {
    console.log('Verify OTP');
    const request_body = JSON.stringify({ otp });
    const response = await axiosInstance.post(
      `${baseUrl}/email/verify`,
      request_body
    );
    setResponse(response.data.message);
    setRequest(true);
  }
  return (
    <div>
      <Modal
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
              onClick={() => {
                handleVerify();
                // handleModalClose();
              }}
            >
              Verify Email
            </Button>
          </div>
          <div>
            <OTPInput length={6} onChange={setOtp} />
            <Button
              size='sm'
              className='mx-auto'
              onClick={() => {
                handleOTPVefify(otp);
                // handleModalClose();
              }}
            >
              send OTP
            </Button>
          </div>
        </div>
      </Modal>
      {response && (
        <Snackbar
          open={request}
          onClose={() => setRequest(false)}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          className='!z-[999]'
        >
          <Alert severity='info' onClose={() => setRequest(false)}>
            {response.toString()}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}
