import { getSession, useSession } from "next-auth/react";
import Sidebar from "../../components/member/Sidebar";
import Image from "next/image";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import {
  QuestionMarkCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  StopCircleIcon,
  UserCircleIcon,
  AtSymbolIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { NextSeo } from "next-seo";

const Profile = ({ memberInfo, wallet }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/board/signin");
    },
  });

  const balance = wallet ? wallet.balance.toLocaleString() : 0;

  const cards = [
    {
      title: "핀코인",
      icon: <StopCircleIcon className='h-6 text-[#25A510]' />,
      iconBg: "bg-[#EAFFE7]",
      link: "/board/wallet",
      tooltip: "",
      content: balance,
    },
    {
      title: "상품구매내역",
      icon: <DocumentTextIcon className='h-6 text-[#B61CEC]' />,
      iconBg: "bg-[#F7E1FF]",
      link: "",
      tooltip: "",
      content: 0,
    },
    {
      title: "내가 쓴 글",
      icon: <PencilSquareIcon className='h-6 text-[#F6C619]' />,
      iconBg: "bg-[#FFF8DD]",
      link: "",
      tooltip: "",
      content: memberInfo?.post,
    },
    {
      title: "내가 쓴 댓글",
      icon: <ChatBubbleBottomCenterTextIcon className='h-6 text-primary' />,
      iconBg: "bg-[#E3F0FF]",
      link: "",
      tooltip: "",
      content: memberInfo?.comment,
    },
  ];

  return (
    <>
      <NextSeo
        title={`내정보`}
        titleTemplate={`내정보`}
        noindex={true}
        nofollow={true}
        description={session?.user.nickname + ` ${session?.user.email}...`}
      />
      <div className='flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50'>
        {/* Sidebar */}
        <Sidebar memberInfo={memberInfo} />
        <div className='mx-auto w-full px-5 md:px-0 gap-4'>
          <div className='white-box p-0 relative'>
            <div className='h-[100px] bg-gradient-to-r from-blue-200 to-pink-200 rounded-t-lg'></div>
            <div className='rounded-full bg-white absolute top-[50px] left-[30px] shadow-md'>
              <Image src='/logo.png' alt='Profile Image' width={100} height={100} priority />
            </div>
            <div className='p-[30px] pt-[60px] space-y-2.5'>
              <div className='font-semibold'>{session?.user.nickname}</div>
              <div>
                @{session?.user.username}
                <span className='mx-2 text-gray-400'>&#x2022;</span>
                <span className='text-gray-400'>{session?.user.email}</span>
              </div>
              <div>
                <button className='blue-button' onClick={() => router.push("/board/profile-edit")}>
                  {t["edit-basic-info"]}
                </button>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-[30px]'>
            {cards.map((card, index) => (
              <Link
                href={card.link}
                className='profile-card hover:no-underline hover:text-inherit hover:shadow-md transition-all'
                key={index}
              >
                <div className='tooltip tooltip-bottom absolute top-2 left-2' data-tip={card.tooltip}>
                  <button>
                    <QuestionMarkCircleIcon className='h-5 text-gray-400' />
                  </button>
                </div>
                <div className={`${card.iconBg} rounded-full p-3 w-fit justify-self-center`}>{card.icon}</div>
                <div className='font-rubik font-semibold text-3xl md:text-4xl mt-2.5'>
                  {card.content.toLocaleString()}
                </div>
                <div className='text-gray-400 mt-4'>{card.title}</div>
              </Link>
            ))}
          </div>

          <div className='white-box mt-[30px] grid justify-center'>
            <div className='bg-primary rounded-3xl p-2.5 w-fit justify-self-center'>
              <AtSymbolIcon className='h-20 text-white' />
            </div>
            <span className='text-2xl mt-5'>텔레그램 채널을 추가하세요</span>
            <button className='blue-button justify-self-center mt-5' onClick={() => router.push("/add")}>
              채널 추가
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  // Get Member Information
  let memberInfo = "";
  const session = await getSession(context);
  if (session?.user) {
    const responseMember = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getmember&userid=${session?.user.id}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
      }
    );
    memberInfo = await responseMember.json();
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/point/getWallet/${session?.user.id}`);
  const result = await response.json();
  const wallet = result.wallet;

  // Return
  return {
    props: { memberInfo, wallet },
  };
};

export default Profile;
