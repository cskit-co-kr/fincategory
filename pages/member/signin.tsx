import { LockClosedIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { Loader } from 'rsuite';

const MemberSignIn = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [loading, setLoading] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      username: usernameInput,
      password: passwordInput,
      redirect: false,
      callbackUrl: router.query.callbackUrl ? (router.query.callbackUrl as string) : '/',
    });
    console.log(result);
    if (result?.error === 'CredentialsSignin') {
      setErrorMessage('Invalid email or password');
      setLoading(false);
    } else if (result?.status === 200) {
      router.push(result?.url as string);
    }
  };

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
              <input
                type='text'
                placeholder='Username'
                className='w-full p-1'
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
            </div>
            <div className='w-full border border-gray-200 rounded-b-md px-4 py-2 flex items-center gap-1 -mt-[1px]'>
              <LockClosedIcon className='h-4' />
              <input
                type='password'
                placeholder='Password'
                className='w-full p-1'
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
            {errorMessage && <p className='text-xs text-red-600 mt-2'>{errorMessage}</p>}
            <button
              className='bg-primary font-semibold text-white py-3 px-5 text-base mt-4 w-full rounded-md flex gap-1 items-center justify-center'
              onClick={(e) => onSubmit(e)}
            >
              {loading && <Loader />}
              <div>Login</div>
            </button>
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
              <Link href={`/member/signup?callbackUrl=${router.query.callbackUrl}`} className='underline'>
                Sign up
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
        destination: '/member/profile',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default MemberSignIn;
