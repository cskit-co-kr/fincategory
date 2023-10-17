import axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { useRouter } from 'next/router';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Language } from '../typings';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import Image from 'next/image';

type Languages = Array<Language>;

type AddComponentProps = {
  categories: any;
  countries: any;
  languages: Languages;
};

const add = ({ categories, countries, languages }: AddComponentProps) => {
  const router = useRouter();

  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const cats = categories?.map((item: any) => {
    const obj = JSON.parse(item.name);
    return {
      value: item.id,
      label: locale === 'ko' ? obj.ko : obj.en,
    };
  });

  const types = [
    {
      value: 'channel',
      label: t["channel-type-channel"],
    },
    {
      value: 'public_group',
      label: t["channel-type-group"],
    },
    {
      value: 'private_group',
      label: t["channel-type-group-private"],
    }
  ]

  const [input, setInput] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const [errorInput, setErrorInput] = useState<string | null>(null);
  const [errorCountry, setErrorCountry] = useState<string | null>(null);
  const [errorLanguage, setErrorLanguage] = useState<string | null>(null);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const [resultState, setResultState] = useState<string | null>(null);
  const [checkStatus, setCheckStatus] = useState<string>();

  async function handleSubmit() {

    input === '' ? setErrorInput(t['please-username']) : errorInput === '' ? setErrorInput(null) : null;
    selectedCountry === '' ? setErrorCountry(t['please-country']) : setErrorCountry(null);
    selectedLanguage === '' ? setErrorLanguage(t['please-language']) : setErrorLanguage(null);
    selectedCategory === '' ? setErrorCategory(t['please-category']) : setErrorCategory(null);
    selectedType === '' ? setErrorType(t['please-type']) : setErrorType(null);

    if (!errorInput && !errorCountry && !errorLanguage && !errorCategory && !errorType) {
      let text = extractUsername(input);
      if (input !== '' && selectedCountry !== '' && selectedLanguage !== '' && selectedCategory !== '') {

        const data = {
          title: text.trim(),
          country: selectedCountry,
          language: selectedLanguage,
          category: selectedCategory,
          type: selectedType
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/addchannel`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result === 'OK') {
          setResultState(`${text} ${t['channel-add']}`);
          setInput('');
          setSelectedCountry('');
          setSelectedLanguage('');
          setSelectedCategory('');
          setSelectedType('')
        } else {
          setResultState(`"${text}" ${t['channel-add-error']}`);
        }
      }
    }

  }
  const extractUsername = (input: any) => {
    let arr = [];
    let text = '';

    if (input.includes('+')) {
      arr = input.split('+');
      text = arr.reverse()[0];
    } else if (input.includes('@')) {
      arr = input.split('@');
      text = arr.reverse()[0];
    } else if (input.includes('/')) {
      arr = input.split('/');
      text = arr.reverse()[0];
    } else {
      text = input;
    }
    return text;
  }

  const checkUsername = async (e: any) => {
    if (e.target.value !== "") {
      const username = extractUsername(e.target.value);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/resolvechannel?username=${username}`);
      const data = await res.data;
      if (data.existed) {
        setErrorInput(t["username-existed"]);
      }
    }
  }

  const onChangeInput = (e: any) => {
    setInput(e.target.value);
    setErrorInput(null);
  }

  return (
    <div className='flex flex-col pt-7 bg-gray-50 min-h-screen'>
      <Head>
        <title>FinCa - {t['add-channel']}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='md:flex md:flex-col w-full xl:w-[1280px] mx-auto'>
        <div className='text-xl font-bold text-center'>{t['add-channel']}</div>
        <div className='p-5 gap-3 border flex flex-col border-gray-200 rounded-md bg-white md:w-2/4 mx-auto mt-4'>
          {resultState !== null ? (
            <div className='flex items-center gap-2 p-3 bg-gray-50 rounded-md font-semibold justify-center'>{resultState}</div>
          ) : (
            ''
          )}
          <label>
            {t['link-to']}
          </label>
          <input
            value={input}
            onChange={onChangeInput}
            onMouseLeave={(e) => checkUsername(e)}
            type='text'
            placeholder='@username, t.me/ASRJIfjdk..., t.me/+ABCD12345'
            className='border border-gray-200 rounded-md p-2 outline-non'
          />


          {errorInput !== null ? <div className='text-red-500 -mt-3 italic'>{errorInput}</div> : ''}

          <label>{t['channel-type']}</label>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className='border border-gray-200 rounded-md p-2 outline-none'
            name='type'
          >
            <option value=''>{t['choose-type']}</option>
            {types.map((cat: any, index: number) => {
              return (
                <option value={cat.value} key={index}>
                  {cat.label}
                </option>
              );
            })}
          </select>
          {errorType !== null ? <div className='text-red-500 -mt-3 italic'>{errorType}</div> : ''}
          <label>{t['country']}</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className='border border-gray-200 rounded-md p-2 outline-none'
          >
            <option value=''>{t['choose-country']}</option>
            {countries.map((country: any, index: number) => {
              return (
                <option value={country.id} key={index}>
                  {t[country.iso as keyof typeof t]}
                </option>
              );
            })}
          </select>
          {errorCountry !== null ? <div className='text-red-500 -mt-3 italic'>{errorCountry}</div> : ''}
          <label>{t['channel-language']}</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className='border border-gray-200 rounded-md p-2 outline-none'
            name='language'
          >
            <option value=''>{t['choose-language']}</option>
            {languages.map((language: Language) => {
              return (
                <option value={language.id} key={language.id}>
                  {t[language.value as keyof typeof t]}
                </option>
              );
            })}
          </select>
          {errorLanguage !== null ? <div className='text-red-500 -mt-3 italic'>{errorLanguage}</div> : ''}
          <label>{t['channel-category']}</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='border border-gray-200 rounded-md p-2 outline-none'
            name='category'
          >
            <option value=''>{t['choose-category']}</option>
            {cats.map((cat: any, index: number) => {
              return (
                <option value={cat.value} key={index}>
                  {cat.label}
                </option>
              );
            })}
          </select>
          {errorCategory !== null ? <div className='text-red-500 -mt-3 italic'>{errorCategory}</div> : ''}



          <button
            onClick={() => handleSubmit()}
            className='bg-primary px-10 rounded-full text-sm py-2 w-fit self-center text-white active:bg-[#143A66]'
          >
            {t['add-channel']}
          </button>
        </div>
        <div className='mx-auto mt-8 text-[#3687E2] font-[500]'>* 채널을 추가하면 24시간~48시간 이내 관리자의 승인 후 채널이 등록됩니다.</div>
      </div>
    </div>
  );
};


export const getServerSideProps = async () => {
  const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`);
  const categories = await result.data;

  const resCountry = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCountry`);
  const countries = await resCountry.data;

  const resLanguage = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getLanguages`);
  const languages = await resLanguage.data;

  return {
    props: { categories, countries, languages },
  };
};

export default add;
