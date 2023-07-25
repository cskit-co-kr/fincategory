import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';

import { ArrowTopRightOnSquareIcon, PlusIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { AutoComplete, Button, Input, Message, PickerHandle, Tag, Tooltip, Whisper, toaster } from 'rsuite';
import { TypeAttributes } from 'rsuite/esm/@types/common';

interface DataTags {
  tag: string
}

const ChannelDetailLeftSidebar = ({ channel }: any) => {
  const [error, setError] = useState<boolean>(false);
  // Tags
  const [tagsList, setTagsList] = useState<Array<string>>([]);
  const [tags, setTags] = useState<Array<string>>([]);
  const [data, setData] = useState<Array<string>>([]);

  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const [editInputIndex, setEditInputIndex] = useState<number>(-1);
  const [editInputValue, setEditInputValue] = useState<string>('');

  const inputRef = useRef<PickerHandle>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channel.channel_id}/avatar.jfif`;

  const message = (type: TypeAttributes.Status, message: string) => (
    <Message showIcon type={type} closable>
      {message}
    </Message>
  );

  const loadTags = async () => {
    const tags: any = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/get`);

    const tagsList = tags.data.reduce((acc: Array<string>, e: DataTags) => {
      acc.push(e.tag);
      return acc;
    }, []);

    console.log('taglist: ', tagsList);

    setTagsList(tagsList);
  }

  useEffect(() => {
    const tags = channel.tags.reduce((acc: Array<string>, e: { id: number, channel_id: number, tag: string }) => {
      acc.push(e.tag);
      return acc;
    }, []);

    setTags(tags);

    if (session?.user.type === 2) {
      loadTags();
    }
  }, []);

  const showInput = () => {
    setInputVisible(true);
  }

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  }

  const handleEditInputChange = (value: string, e: ChangeEvent<HTMLInputElement>) => {
    const val = value.replace(/[&\/\\!@#,^+()$~%.'":;*\]\[?<>_{}=\-|` ]/g, '').toLowerCase();

    setEditInputValue(val);
  }

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  }

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
    setData([]);
  }

  const handleSearch = async (newValue: string) => {
    const val = newValue.replace(/[&\/\\!@#,^+()$~%.'":;*\]\[?<>_{}=\-|` ]/g, '').toLowerCase();

    if (val && val.length > 0) {
      const data: any = tagsList.filter((t: string) => t.startsWith(val));
      setData(data);
      setInputValue(val);
    } else {
      setData([]);
      setInputValue('');
    }
  }

  const onSelect = (data: string) => {
    if (data && tags.indexOf(data) === -1) {
      setTags([...tags, data]);
    }
    setInputVisible(false);
    setInputValue('');
    setData([]);
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleInputConfirm();
    }
  }

  const tagInputStyle: React.CSSProperties = {
    width: 160,
    verticalAlign: 'top',
    marginBottom: 10
  }

  const saveTag = async () => {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/update`, {
      tags: tags,
      channel: channel.channel_id
    });

    const data = res.data;

    if (res.status === 200 && data.code === 200) {
      toaster.push(message('info', t['tag-saved']), {
        placement: 'topEnd',
        duration: 5000
      });
    } else {
      toaster.push(message('error', 'UnSuccessfull'), {
        placement: 'topEnd',
        duration: 5000
      });
    }
    loadTags();
  }

  return (
    <div className='flex flex-col w-full md:w-80 md:min-w-[314px] mt-4 md:mt-0 md:mr-4'>
      <div className='sticky inset-y-4'>
        <div className='flex flex-col gap-y-5 border border-gray-200 rounded-md p-4 bg-white items-center'>
          <Image
            src={error ? '/telegram-icon-96.png' : avatar}
            alt={channel.title}
            width={170}
            height={170}
            className='rounded-full object-contain w-20 h-20 md:w-[170px] md:h-[170px]'
            onError={() => setError(true)}
          />
          <div className='text-xl font-semibold text-center'>{channel.title}</div>
          <a
            href={`https://t.me/${channel.username}`}
            target='_blank'
            className='flex items-center gap-1 w-min border-2 border-primary px-3 py-1 rounded-full text-primary text-sm 
                            transition ease-in-out duration-300 hover:bg-primary hover:no-underline hover:text-white'
          >
            @{channel.username}
            <ArrowTopRightOnSquareIcon className='h-4' />
          </a>
          <p className='break-all'>{channel.description}</p>
          <div className='flex flex-col justify-between w-full'>
            <span className='text-gray-400'>{t['category']}</span>
            <span className='text-primary'>{channel.category && JSON.parse(channel.category.name)[locale]}</span>
          </div>
          <div className='flex flex-col justify-between w-full'>
            <span className='text-gray-400'>{t['channel-region-and-language']}</span>
            <div className='flex gap-5'>
              <span>{t[channel.country.iso as keyof typeof t]}</span>
              <span>{channel.language && t[channel.language.value as keyof typeof t]}</span>
            </div>
          </div>
          <div className='flex flex-col justify-between w-full'>
            <span className='text-gray-400'>{t['tags']}</span>
            {session?.user.type === 2 ?
              <div className='admin-mode mt-1'>
                <div className='mb-1 '>
                  {tags.map((tag, index: number) => {
                    if (editInputIndex === index) {
                      return (
                        <Input
                          ref={editInputRef}
                          key={tag}
                          size="xs"
                          style={tagInputStyle}
                          value={editInputValue}
                          onChange={handleEditInputChange}
                          onBlur={handleEditInputConfirm}
                          onPressEnter={handleEditInputConfirm}
                          className='focus-within:outline-none'
                        />
                      );
                    }
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Whisper key={tag} trigger={'hover'} placement={'bottom'} speaker={<Tooltip>Double Click to Edit</Tooltip>}>
                        <Tag
                          key={tag}
                          closable={true}
                          style={{ userSelect: 'none', marginBottom: 4 }}
                          onClose={() => handleClose(tag)}
                        >
                          <span onDoubleClick={(e) => {
                            setEditInputIndex(index);
                            setEditInputValue(tag);
                            e.preventDefault();
                          }}
                          >
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                          </span>
                        </Tag>
                      </Whisper>
                    );
                    return isLongTag ? (
                      <Tooltip title={tag} key={tag}>
                        {tagElem}
                      </Tooltip>
                    ) : (
                      tagElem
                    );
                  })}
                </div>
                {inputVisible ? (
                  <div className='border-t-[1px] pt-2 flex items-center'>
                    <AutoComplete
                      ref={inputRef}
                      onChange={handleSearch}
                      onSelect={onSelect}
                      onBlur={handleInputConfirm}
                      onKeyUp={handleKeyDown}
                      data={data}
                      size='xs'
                      className='w-[160px] focus-within:outline-none'
                    />
                  </div>
                ) : (
                  <div className='border-t-[1px] pt-2 flex items-center'>
                    <span className='flex items-center bg-[#3498ff] text-white border border-dashed text-[12px] rounded-md pr-2 mr-2' onClick={showInput}>
                      <PlusSmallIcon className='h-6 w-6 text-white' /> New Tag
                    </span>
                    <Button appearance='primary' size='xs' className='bg-[#3498ff] border border-dashed' onClick={saveTag}>Save</Button>
                  </div>
                )}
              </div>
              :
              <div className='hashtags flex gap-1'>
                {channel.tags.map((tag: { id: number, channel_id: number, tag: string }) => {
                  return (
                    <Link href={`/search?q=#${tag.tag}`} className='text-primary' key={tag.id}>#{tag.tag}</Link>
                  )
                })}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailLeftSidebar;
