import Button from '@/components/Atoms/Button';
import NotFoundImage from '@/images/NotFoundImage.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function PageNotFound() {
  return (
    <div className='flex items-center flex-col justify-center h-full w-full'>
      <Image
        src={NotFoundImage}
        width={500}
        className='my-6'
        height={500}
        alt='not found error image'
      />
      <div className='text-center space-y-4'>
        <h3 className='text-4xl'>
          <span className='text-primary'>Sorry!</span> this page isn&apos;t
          available
        </h3>
        <span className='block pb-6 text-lg text-subtext'>
          The page you are looking for couldn&apos;t be found
        </span>
        <Link href='/students/dashboard' className='mx-auto bg-primary text-white my-3 rounded-md px-4 py-2'>Go to dashboard</Link>
      </div>
    </div>
  );
}
