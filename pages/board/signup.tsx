import { LockClosedIcon, UserCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const MemberSignUp = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const schema = yup.object().shape({
    userName: yup
      .string()
      .min(5, "no to min 5")
      .max(20, "no to max 20")
      .required("You can't leave this empty.")
      .test("usernameAvailable", "Username already taken", (value) => validateUsername(value)),
    fullName: yup.string().required("You can't leave this empty."),
    email: yup
      .string()
      .email("Invalid email address")
      .required("You can't leave this empty")
      .test("emailAvailable", "Email is already registered", (value) => validateEmail(value)),
    password: yup.string().min(6, "no to min 6").max(20, "no to max 20").required("You can't leave this empty."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), undefined], "Passwords must match")
      .required("You can't leave this empty."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const validateUsername = async (value: string) => {
    if (value.length < 5 || value.length > 20) {
      return true; // Skip validation if length is below or equal to 5
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=checkusername&username=${value}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
      }
    );
    const { total } = await response.json();

    if (total === 1) {
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
      method: "POST",
      headers: { "content-type": "application/json" },
    });
    const { total } = await response.json();

    if (total === 1) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (data: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: data.userName,
        nickname: data.fullName,
        password: data.password,
        email: data.email,
      }),
    });
    const result = await response.json();
    if (result.code === 200 && result.message === "Inserted") {
      router.push("/board/success");
    }
  };

  return (
    <>
      <div className='gap-4 pt-7 bg-gray-50'>
        <div className='w-full xl:w-[500px] mx-auto border border-gray-200 bg-white rounded-md p-[30px] shadow-sm'>
          <div className='flex gap-2 items-center border-b border-gray-200 pb-2.5'>
            <UserCircleIcon className='h-6 text-black' />
            <span className='font-semibold'>{t["sign-up"]}</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='mt-4 gap-4 grid'>
            <div>
              <label className='block pb-1'>{t["username"]}</label>
              <input type='text' className='input_field' {...register("userName")} />
              <p className='text-xs text-red-600'>{errors.userName?.message?.toString()}</p>
            </div>
            <div>
              <label className='block pb-1'>{t["nickname"]}</label>
              <input type='text' className='input_field' {...register("fullName")} />
              <p className='text-xs text-red-600'>{errors.fullName?.message?.toString()}</p>
            </div>
            <div>
              <label className='block pb-1'>{t["email"]}</label>
              <input type='text' className='input_field' {...register("email")} />
              <p className='text-xs text-red-600'>{errors.email?.message?.toString()}</p>
            </div>
            <div>
              <label className='block pb-1'>{t["password"]}</label>
              <input type='password' className='input_field' {...register("password")} />
              <p className='text-xs text-red-600'>{errors.password?.message?.toString()}</p>
            </div>
            <div>
              <label className='block pb-1'>{t["password-confirm"]}</label>
              <input type='password' className='input_field' {...register("confirmPassword")} />
              <p className='text-xs text-red-600'>{errors.confirmPassword?.message?.toString()}</p>
            </div>
            <button
              className='bg-primary font-semibold text-white py-3 px-5 text-base mt-4 w-full rounded-md'
              type='submit'
            >
              {t["sign-up"]}
            </button>
          </form>

          <div className='mt-4 flex divide-x place-content-center'>
            <div className='px-4'>
              <Link href='/' className='underline'>
                {t["forgot-password"]}
              </Link>
              ?
            </div>
            <div className='px-4'>
              <Link href={`/board/signin`} className='underline'>
                {t["sign-in"]}
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
        destination: "/board/profile", // Redirect to the login page if not logged in
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default MemberSignUp;
