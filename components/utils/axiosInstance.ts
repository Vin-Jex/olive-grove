import axios from 'axios';
import Cookies from 'js-cookie';
import { baseUrl } from './baseURL';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (request) => {
    console.log('making the fugging request');
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    if (accessToken && refreshToken) {
      request.headers.Authorization = `Bearer accessToken=${accessToken};refreshToken=${refreshToken}`;
    }
    console.log('This is the request from the request', request);
    return request;
  },
  (error) => {
    console.log('this is frmo the axios error on request');
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('what is this respnse from the response', response.headers);
    const accessToken = response.headers['x-access-token'];
    const refreshToken = response.headers['x-refresh-token'];
    const expiryDate = new Date().setDate(new Date().getDate() + 1);

    console.log('Tihs is the response accessToken', accessToken);
    console.log('This is the refreshToken', refreshToken);
    accessToken !== undefined &&
      Cookies.set('accessToken', accessToken, { expires: expiryDate });
    refreshToken !== undefined &&
      Cookies.set('refreshToken', refreshToken, { expires: expiryDate });
    return response;
  }, // Directly return successful responses.
  async (error) => {
    // const originalRequest = error.config;
    // console.log('This is the axios response', error.response);
    return Promise.reject(error);
  }
);

export default axiosInstance;
