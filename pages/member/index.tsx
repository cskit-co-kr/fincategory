import { LockClosedIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Member = () => {
  const router = useRouter();

  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  return (
    <>
      <div className='gap-4 pt-7 bg-gray-50'>
        <div className='w-full xl:w-[500px] mx-auto border border-gray-200 bg-white rounded-md p-[30px] shadow-sm'>
          <div className='flex gap-2 items-center border-b border-gray-200 pb-2.5'>
            <UserCircleIcon className='h-6 text-black' />
            <span className='font-semibold'>ID {t['sign-in']}</span>
          </div>
          <div className='mt-4'>
            <div className='w-full border border-gray-200 rounded-t-md px-4 py-2 flex items-center gap-1'>
              <UserIcon className='h-4' />
              <input type='text' placeholder='Username' className='w-full p-1' />
            </div>
            <div className='w-full border border-gray-200 rounded-b-md px-4 py-2 flex items-center gap-1 -mt-[1px]'>
              <LockClosedIcon className='h-4' />
              <input type='password' placeholder='Password' className='w-full p-1' />
            </div>
            <button className='bg-primary font-semibold text-white py-3 px-5 text-base mt-4 w-full rounded-md'>Login</button>
          </div>
          <div className='mt-4 flex divide-x place-content-center'>
            <div className='px-4'>
              Forgot your{' '}
              <Link href='/' className='underline'>
                Password
              </Link>
              ?
            </div>
            <div className='px-4'>
              <Link href='/' className='underline'>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Member;
