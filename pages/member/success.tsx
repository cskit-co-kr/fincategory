import { LockClosedIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { getSession } from 'next-auth/react';

const MemberSuccess = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  return (
    <>
      <div className='gap-4 pt-7 bg-gray-50'>
        <div className='w-full xl:w-[500px] mx-auto border border-gray-200 bg-white rounded-md p-[30px] shadow-sm'>
          <div className='text-center gap-1 grid'>
            <div className='font-semibold'>Congratulations!</div>
            <div className=''>Your account is successfully created!</div>
            <div>
              Go to{' '}
              <Link href='/member/signin?callbackUrl=/board' className='underline'>
                Login Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/member/profile', // Redirect to the login page if not logged in
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default MemberSuccess;
