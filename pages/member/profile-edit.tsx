import { useSession, getSession } from 'next-auth/react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Loader } from 'rsuite';
import Sidebar from '../../components/member/Sidebar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Profile = ({ memberInfo }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/member/signin');
    },
  });

  const [updateText, setUpdateText] = useState('');
  const [updatePasswordText, setUpdatePasswordText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const schema = yup.object().shape({
    userName: yup
      .string()
      .min(5, 'no to min 5')
      .max(20, 'no to max 20')
      .required("You can't leave this empty.")
      .test('usernameAvailable', 'Username already taken', (value) => validateUsername(value)),
    fullName: yup.string().required("You can't leave this empty."),
    email: yup
      .string()
      .email('Invalid email address')
      .required("You can't leave this empty")
      .test('emailAvailable', 'Email is already registered', (value) => validateEmail(value)),
  });
  const schema2 = yup.object().shape({
    oldPassword: yup.string().required("You can't leave this empty."),
    password: yup.string().min(6, 'no to min 6').max(20, 'no to max 20').required("You can't leave this empty."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Passwords must match')
      .required("You can't leave this empty."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm({
    resolver: yupResolver(schema2),
  });

  const validateUsername = async (value: string) => {
    if (value.length < 5 || value.length > 20) {
      return true; // Skip validation if length is below or equal to 5
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=checkusername&username=${value}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    const { total } = await response.json();

    if (total === 1 && value !== session?.user.username) {
      return false;
    } else {
      return true;
    }
  };

  const validateEmail = async (value: string) => {
    if (value.length < 5) {
      return true; // Skip validation if length is below or equal to 5
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=checkemail&email=${value}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    const { total } = await response.json();

    if (total === 1 && value !== session?.user.email) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (data: any) => {
    setUpdateText('');
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=update`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        userid: session?.user.id,
        username: data.userName,
        nickname: data.fullName,
        email: data.email,
      }),
    });
    const result = await response.json();
    setLoading(false);
    if (result.code === 200 && result.message === 'Success') {
      await update({
        ...session,
        user: {
          ...session?.user,
          nickname: data.fullName,
          email: data.email,
        },
      });
      setUpdateText(t['updated-successfully']);
    }
  };
  const onChangePassword = async (data: any) => {
    setUpdatePasswordText('');
    setLoading2(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=updatepassword`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        old: data.oldPassword,
        password: data.password,
        userid: session?.user.id,
      }),
    });
    const result = await response.json();
    setLoading2(false);
    if (result.code === 200 && result.message === 'Password Changed') {
      setUpdatePasswordText(t['updated-successfully']);
    } else if (result.code === 201) {
      setUpdatePasswordText('Old Password Incorrect!');
    }
  };

  return (
    <>
      <div className='flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50'>
        <Sidebar memberInfo={memberInfo} />
        <div className='mx-auto w-full px-5 md:px-0 gap-4'>
          <button
            onClick={() => router.back()}
            className='hidden md:flex gap-1 items-center border border-gray-200 rounded-full px-4 py-2 mb-4 text-xs'
          >
            <ArrowLeftIcon className='h-4' />
            뒤로
          </button>
          <div className='white-box'>
            <div className='font-semibold'>{t['edit-basic-info']}</div>
            {updateText !== '' && <div className='bg-gray-100 p-4 text-center rounded-lg mt-4'>{updateText}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className='mt-4 gap-4 grid border-t border-gray-200 pt-4'>
              <div>
                <label className='block pb-1'>{t['username']}</label>
                <input type='text' className='input_field' defaultValue={session?.user.username} {...register('userName')} />
                <p className='text-xs text-red-600'>{errors.userName?.message?.toString()}</p>
              </div>
              <div>
                <label className='block pb-1'>{t['nickname']}</label>
                <input type='text' className='input_field' defaultValue={session?.user.nickname} {...register('fullName')} />
                <p className='text-xs text-red-600'>{errors.fullName?.message?.toString()}</p>
              </div>
              <div>
                <label className='block pb-1'>{t['email']}</label>
                <input type='text' className='input_field' defaultValue={session?.user.email} {...register('email')} />
                <p className='text-xs text-red-600'>{errors.email?.message?.toString()}</p>
              </div>
              <button className='blue-button place-self-center' type='submit'>
                {loading && <Loader />}등록
              </button>
            </form>
          </div>

          <div className='white-box mt-4'>
            <div className='font-semibold'>비밀번호 변경</div>
            {updatePasswordText !== '' && <div className='bg-gray-100 p-4 text-center rounded-lg mt-4'>{updatePasswordText}</div>}
            <form onSubmit={handleSubmit2(onChangePassword)} className='mt-4 gap-4 grid border-t border-gray-200 pt-4'>
              <div>
                <label className='block pb-1'>현재 비밀번호</label>
                <input type='password' className='input_field' {...register2('oldPassword')} />
                <p className='text-xs text-red-600'>{errors2.oldPassword?.message?.toString()}</p>
              </div>
              <div>
                <label className='block pb-1'>신규 비밀번호</label>
                <input type='password' className='input_field' {...register2('password')} />
                <p className='text-xs text-red-600'>{errors2.password?.message?.toString()}</p>
              </div>
              <div>
                <label className='block pb-1'>{t['password-confirm']}</label>
                <input type='password' className='input_field' {...register2('confirmPassword')} />
                <p className='text-xs text-red-600'>{errors2.confirmPassword?.message?.toString()}</p>
              </div>
              <button className='blue-button place-self-center' type='submit'>
                {loading2 && <Loader />}등록
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  // Get Member Information
  let memberInfo = '';
  const session = await getSession(context);
  if (session?.user) {
    const responseMember = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getmember&userid=${session?.user.id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    memberInfo = await responseMember.json();
  }

  // Return
  return {
    props: { memberInfo },
  };
};

export default Profile;
