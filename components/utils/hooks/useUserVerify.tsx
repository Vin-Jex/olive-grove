import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { baseUrl } from '../baseURL';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

type DeptData = {
  _id: string;
  name: string;
  category: string;
  description: string;
};

const useUserVerify = () => {
  const [message, setMessage] = useState<{
    message: string;
    success: boolean;
    error: boolean;
  }>({
    message: '',
    success: false,
    error: false,
  });
  const [fetchedDept, setFetchedDept] = useState<DeptData[]>([]);
  const [otpRequestLoading, setOtpRequestLoading] = useState(false);
  const [verifyOTP, setVerifyOTP] = useState({
    status: false,
    message: 'To change your password,',
  });
  const [OTPTimer, setOTPTimer] = useState(0);
  const [formattedTimer, setFormattedTimer] = useState('00:00');

  useEffect(() => {
    async function fetchDepartment() {
      try {
        const response = await fetch(`${baseUrl}/department/all`);
        if (!response.ok) {
          console.log('failed to fetch department');
        }
        const dept = await response.json();

        setFetchedDept(dept.data);
      } catch (err) {
        toast.error('An error occurred while fetching department');
        console.error(err, 'error');
      }
    }
    fetchDepartment();
  }, []);

  useEffect(() => {
    if (OTPTimer > 0) {
      const interval = setInterval(() => {
        setOTPTimer((prev) => prev - 1);
      }, 1000);

      const minutes = Math.floor(OTPTimer / 60);
      const seconds = OTPTimer % 60;
      setFormattedTimer(
        `${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`
      );

      return () => clearInterval(interval);
    } else {
      setFormattedTimer('00:00');
    }
  }, [OTPTimer]);

  const handleRequestOTP = async (
    type: 'email_verification' | 'password_reset'
  ) => {
    setOtpRequestLoading(true);
    setOTPTimer(2 * 60);

    const requestBody = { type };

    try {
      const response = await axiosInstance.post(
        `${baseUrl}/otp/request`,
        requestBody
      );
      setVerifyOTP({ status: true, message: response.data?.message });
      toast.success(response.data?.message);
      setMessage({
        success: true,
        error: false,
        message: response.data?.message || 'OTP sent to your email',
      });
    } catch (err: AxiosError | any) {
      const message = err.response?.data?.message;
      toast.error(message);
      setMessage({
        success: false,
        error: true,
        message: err?.response?.data?.message || err.message,
      });
      console.error(err);
    } finally {
      setOtpRequestLoading(false);
    }
  };

  return {
    otpRequestLoading,
    message,
    setMessage,
    handleRequestOTP,
    verifyOTP,
    fetchedDept,
    OTPTimer,
    setOTPTimer,
    setFormattedTimer,
    formattedTimer,
  };
};

export default useUserVerify;
