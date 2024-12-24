import NotFoundError from '@/components/Atoms/NotFoundError';
import React from 'react';
import PageNotFound from './students/PageNotFound';

const ErrorPage = () => {
  return (
    <div className='h-screen'>
      <PageNotFound />
    </div>
  );
};

export default ErrorPage;
