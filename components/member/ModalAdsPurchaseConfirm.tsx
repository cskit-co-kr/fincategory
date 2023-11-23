import { Loader, Notification, useToaster, Checkbox } from 'rsuite';
import apiService from '../../lib/apiService';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import ChannelAvatar from '../channel/ChannelAvatar';
import { AiFillCheckCircle } from 'react-icons/ai';

const ModalAdsPurchaseConfirm = ({ data, balance, modalId, adsGroup, userId }: any) => {
  const toaster = useToaster();

  const [lowBalance, setLowBalance] = useState<string | null>(null);
  const [channelError, setChannelError] = useState<string | null>(null);
  const [channel, setChannel] = useState('');
  const [checkUser, setCheckUser] = useState<string | null>(null);
  const [checkUsernameLoading, setCheckUsernameLoading] = useState(false);
  const [checkChannel, setCheckChannel] = useState<any | null>(null);
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
  };
  const checkUsername = async () => {
    if (channel !== '') {
      setCheckUsernameLoading(true);
      setCheckUser(null);
      setCheckChannel(null);
      setChannelError(null);
      const username = extractUsername(channel);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/resolvechannel?username=${username}`);
      const data = await res.data;
      if (data.existed) {
        setCheckUser('Channel existed in our database!');
        setCheckChannel(data);
      } else {
        setCheckUser('입력하신 채널/그룹은 핀카에 없습니다. ');
      }
      setCheckUsernameLoading(false);
    }
  };

  const submitPurchase = async () => {
    if (balance < data.coin) {
      return setLowBalance('잔액이 부족합니다.');
    } else if (!checkChannel) {
      return setChannelError('Input valid Channel');
    } else {
      const d = {
        product_info_id: data.id,
        channel_id: checkChannel.channel.id,
        user_id: userId,
      };
      const result = await apiService.saveAdsPurchase(d);

      if (result.code === 400) {
        alert('Sold Out');
      } else if (result.code === 201) {
        const modal = document.getElementById(`${adsGroup}_modal_${modalId}`) as any;
        modal?.close();

        const message = (
          <Notification type='info' closable>
            <div className='flex items-center gap-2'>
              <Image src='/party.svg' width={24} height={24} alt='Success' />
              광고상품 구매 완료하였습니다.
            </div>
          </Notification>
        );

        toaster.push(message, { placement: 'topCenter' });
      }
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      checkUsername();
    }
  };

  return (
    <dialog id={`${adsGroup}_modal_${modalId}`} className='modal'>
      <div className='modal-box p-10 max-w-[475px]'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
        </form>
        <div className='text-2xl font-medium text-center'>광고상품 구매</div>
        <div className='mt-5 mx-auto grid space-y-6'>
          <div className='space-y-2'>
            <div className='font-semibold'>상품명:</div>
            <div>
              <input
                className='border border-[#d9d9d9] rounded-md px-3 py-2 w-full'
                value={`${adsGroup === 'ads1' ? '최상단 배너' : '첫 페이지 노출'} ${data.duration}`}
                disabled
              />
            </div>
          </div>
          <div className='space-y-2'>
            <div className='font-semibold'>제품 가격</div>
            <div>
              <input
                className='border border-[#d9d9d9] rounded-md px-3 py-2 w-full'
                value={`${data.coin.toLocaleString()} FinCoin`}
                disabled
              />
            </div>
          </div>
          <div className='space-y-2'>
            <div className='font-semibold'>텔레그램 채널/그룹 ID</div>
            <div className='flex gap-2 relative'>
              <input
                className={`border rounded-md px-3 py-2 w-full ${channelError ? 'border-red-500' : 'border-[#d9d9d9]'}`}
                placeholder='광고할 채널/그룹 ID를 입력하세요.'
                value={channel}
                onChange={(e: any) => setChannel(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {checkUsernameLoading && <Loader className='absolute right-[90px] top-3 h-6' />}
              <button className='blue-button' onClick={checkUsername}>
                확인
              </button>
            </div>
            {!checkChannel?.existed ? (
              <div className='text-xs'>
                {checkUser && (
                  <>
                    {checkUser}
                    <Link href='/add' target='_blank' className='text-red-500 font-semibold ml-2'>
                      [등록하기]
                    </Link>
                  </>
                )}
              </div>
            ) : (
              checkChannel && (
                <div className='flex items-center gap-2'>
                  <AiFillCheckCircle size={22} className='text-green-500' />
                  <div className='flex gap-2 items-center text-xs rounded-full bg-gray-100 pl-1 pr-2 py-1 w-fit'>
                    <ChannelAvatar
                      id={checkChannel?.channel.channel_id}
                      title={checkChannel?.channel.title}
                      size='20'
                      shape='rounded-full'
                    />
                    {checkChannel.channel.title}
                  </div>
                </div>
              )
            )}
            {channelError && <div className='text-red-500 italic text-xs'>{channelError}</div>}
          </div>
          <div className='space-y-2'>
            <div className='font-semibold'>사용자 지갑 잔액:</div>
            <div className='flex gap-2'>
              <input
                className={`border rounded-md px-3 py-2 w-full ${lowBalance ? 'border-red-500' : 'border-[#d9d9d9]'}`}
                value={balance}
                disabled
              />
              <Link href='/member/fincoin-purchase' className='blue-button'>
                핀코인 구매
              </Link>
            </div>
            {lowBalance && <div className='text-red-500 italic text-xs'>{lowBalance}</div>}
          </div>
          <div className='mx-auto flex items-center gap-2 py-5'>
            <form method='dialog'>
              <button className='gray-button'>취소</button>
            </form>
            <button className='blue-button' onClick={submitPurchase}>
              구매
            </button>
          </div>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModalAdsPurchaseConfirm;
