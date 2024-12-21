import React, { FormEvent, useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { baseUrl } from '../baseURL';
import { AxiosError } from 'axios';

const useUserVerify = () => {
  const [somethingOccured, setSomethingOccured] = useState({
    message: '',
    success: false,
    error: false,
  });
  const [otpRequestLoading, setOtpRequestLoading] = useState(false);

  const [verifyOTP, setVerifyOTP] = useState({
    status: false,
    message: 'To change your password,',
  });
  const [OTPTimer, setOTPTimer] = useState(0);

  useEffect(() => {
    if (OTPTimer > 0) {
      const interval = setInterval(() => {
        setOTPTimer((timer) => timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [OTPTimer]);

  //   async function handleRequestOTP(event: FormEvent<HTMLButtonElement>) {
  //     event.preventDefault();
  //     try {
  //         setOTPVerifyLoading(true);
  //       const request_body = JSON.stringify({ type: 'password_reset' }); //this should be the password chaange equivalent
  //       const response = await axiosInstance.post(
  //         `${baseUrl}/otp/request`,
  //         request_body
  //       );
  //       setVerifyOTP({ status: true, message: 'OTP sent to your email' });
  //       setSomethingOccured((err) => ({
  //         ...err,
  //         error: false,
  //         success: true,
  //         message: response.data.data.message,
  //       }));
  //       setOTPTimer(2 * 60); // 2 minutes
  //     } catch (error: AxiosError | any) {
  //       setSomethingOccured((err) => ({
  //         ...err,
  //         error: true,
  //         message: error.response.data.message,
  //       }));
  //       console.error(error);
  //     } finally {
  //       setVerifyOTP({ status: false, message: 'To change your password' });
  //     }
  //   }

  async function handleRequestOTP(
    type: 'email_verification' | 'password_reset'
  ) {
    try {
      setOtpRequestLoading(true);
      const request_body = JSON.stringify({ type });
      const response = await axiosInstance.post(
        `${baseUrl}/otp/request`,
        request_body
      );
      setVerifyOTP({ status: true, message: 'OTP sent to your email' });
      setSomethingOccured({
        error: false,
        success: true,
        message: response.data.data.message,
      });
      setOTPTimer(2 * 60); // 2 minutes
    } catch (err: AxiosError | any) {
      setSomethingOccured({
        success: false,
        error: true,
        message: err.response.data.message,
      });
      console.error(err);
    } finally {
      setOtpRequestLoading(false);
    }
  }

  return {
    otpRequestLoading,
    setSomethingOccured,
    handleRequestOTP,
    somethingOccured,
    verifyOTP,
    OTPTimer,
  };
};

export default useUserVerify;
