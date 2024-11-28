import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import Sidebar from "../../components/member/Sidebar";
import GuideImage from "../../public/fincoin-purchase-guide.png";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Table } from "rsuite";
import { useEffect, useState } from "react";
import ModalFincoinPurchaseConfirm from "../../components/member/ModalFincoinPurchaseConfirm";
import Link from "next/link";

const { Column, HeaderCell, Cell } = Table;

const data = [
  {
    id: 0,
    col1: 50000,
    col2: 50000,
    col3: 5000,
    col4: 55000,
  },
  {
    id: 1,
    col1: 100000,
    col2: 100000,
    col3: 10000,
    col4: 110000,
  },
  {
    id: 2,
    col1: 200000,
    col2: 200000,
    col3: 20000,
    col4: 220000,
  },
  {
    id: 3,
    col1: 500000,
    col2: 500000,
    col3: 50000,
    col4: 550000,
  },
  {
    id: 4,
    col1: 1000000,
    col2: 1000000,
    col3: 100000,
    col4: 1100000,
  },
  {
    id: 5,
    col1: 5000000,
    col2: 5000000,
    col3: 500000,
    col4: 5500000,
  },
];

const FincoinPurchaseGuide = ({ memberInfo }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/board/signin");
    },
  });
  const [purchaseInfo, setPurchaseInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  useEffect(() => {
    session && setPurchaseInfo({ ...purchaseInfo, email: session.user.email });
  }, [session]);

  const [errors, setErrors] = useState<{
    name: string | null;
    phone: string | null;
    email: string | null;
  }>({
    name: null,
    phone: null,
    email: null,
  });

  const [selectedOption, setSelectedOption] = useState(0);
  const rowClickHandle = (rowData: any) => {
    setSelectedOption(rowData.id);
  };

  const showConfirm = () => {
    const updatedErrors = {
      name: purchaseInfo.name === "" ? "Please input name" : null,
      phone: purchaseInfo.phone === "" ? "Please input phone" : null,
      email: purchaseInfo.email === "" ? "Please input email" : null,
    };

    setErrors(updatedErrors);

    if (!updatedErrors.name && !updatedErrors.phone && !updatedErrors.email) {
      const modal = document.getElementById("my_modal_1") as any;
      modal?.showModal();
    }
  };

  return (
    <>
      <div className="flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50">
        <Sidebar memberInfo={memberInfo} />
        <div className="mx-auto w-full px-5 md:px-0 gap-4">
          <button
            onClick={() => router.back()}
            className="hidden md:flex gap-1 items-center border border-gray-200 rounded-full px-4 py-2 mb-4 text-xs"
          >
            <ArrowLeftIcon className="h-4" />
            {t["뒤로"]}
          </button>
          <div className="white-box">
            <div className="text-xl font-bold">핀코인 구매 안내</div>
            <div className="grid justify-center mt-[30px]">
              <Table
                data={data}
                width={690}
                onRowClick={rowClickHandle}
                bordered
                cellBordered
                autoHeight
                className="rounded-lg"
              >
                <Column width={50} align="center">
                  <HeaderCell>선택</HeaderCell>
                  <Cell className="cursor-pointer">
                    {(rowData) => (
                      <input
                        type="radio"
                        name="id"
                        value={rowData.id}
                        checked={selectedOption === rowData.id}
                        onChange={() => {}}
                        className="cursor-pointer"
                      />
                    )}
                  </Cell>
                </Column>
                <Column width={160} align="center">
                  <HeaderCell>{t["핀코인"]}</HeaderCell>
                  <Cell dataKey="col1" className="cursor-pointer">
                    {(rowData) => `${rowData.col1.toLocaleString()} FinCoin`}
                  </Cell>
                </Column>
                <Column width={160} align="center">
                  <HeaderCell>원화 구입금액</HeaderCell>
                  <Cell dataKey="col2" className="cursor-pointer">
                    {(rowData) => `${rowData.col2.toLocaleString()}원`}
                  </Cell>
                </Column>
                <Column width={160} align="center">
                  <HeaderCell>부가세 (10%)</HeaderCell>
                  <Cell dataKey="col3" className="cursor-pointer">
                    {(rowData) => `${rowData.col3.toLocaleString()}원`}
                  </Cell>
                </Column>
                <Column width={160} align="center">
                  <HeaderCell>합계(부가세포함)</HeaderCell>
                  <Cell dataKey="col4" className="cursor-pointer">
                    {(rowData) => `${rowData.col4.toLocaleString()}원`}
                  </Cell>
                </Column>
              </Table>
            </div>
            <div className="mt-10 max-w-[690px] border border-gray-100 rounded-lg mx-auto grid">
              <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
                <div className="font-semibold">
                  구매자 ID / {t["nickname"]}:
                </div>
                <div>
                  {session?.user.username} / {session?.user.nickname}
                </div>
              </div>
              <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
                <div className="font-semibold">구입 할 핀코인:</div>
                <div>{data[selectedOption].col1.toLocaleString()} FinCoin</div>
              </div>
              <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
                <div className="font-semibold">입금액:</div>
                <div>{data[selectedOption].col4.toLocaleString()} 원</div>
              </div>
              <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
                <div className="font-semibold">입금 계좌번호:</div>
                <div>
                  <Link
                    href="https://t.me/fincatele"
                    target="_blank"
                    className="font-bold underline"
                  >
                    @fincatele
                  </Link>{" "}
                  메시지로 입금방법 문의주세요
                </div>
              </div>
              <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
                <div className="font-semibold">
                  입금자 명<span className="text-red-500">*</span>:
                </div>
                <div>
                  <input
                    type="text"
                    className="border border-gray-200 w-full rounded-lg px-2.5 py-1"
                    name="name"
                    value={purchaseInfo.name}
                    onChange={(e) =>
                      setPurchaseInfo({ ...purchaseInfo, name: e.target.value })
                    }
                  />
                  {errors.name ? (
                    <div className="text-red-500 italic text-end">
                      {errors.name}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="px-5 py-2.5 border-b border-gray-100 font-semibold">
                입금 오류 발생시 연락할 연락처 또는 이메일 주소
              </div>
              <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
                <div className="font-semibold">
                  연락처<span className="text-red-500">*</span>:
                </div>
                <div>
                  <input
                    type="text"
                    className="border border-gray-200 w-full rounded-lg px-2.5 py-1"
                    name="phone"
                    value={purchaseInfo.phone}
                    onChange={(e) =>
                      setPurchaseInfo({
                        ...purchaseInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                  {errors.phone ? (
                    <div className="text-red-500 italic text-end">
                      {errors.phone}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
                <div className="font-semibold">
                  이메일 주소<span className="text-red-500">*</span>:
                </div>
                <div>
                  <input
                    type="text"
                    className="border border-gray-200 w-full rounded-lg px-2.5 py-1"
                    name="email"
                    value={purchaseInfo.email}
                    onChange={(e) =>
                      setPurchaseInfo({
                        ...purchaseInfo,
                        email: e.target.value,
                      })
                    }
                  />
                  {errors.email ? (
                    <div className="text-red-500 italic text-end">
                      {errors.email}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <button
                className="blue-button m-2.5 justify-self-center"
                onClick={showConfirm}
              >
                구매하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <ModalFincoinPurchaseConfirm
        purchaseInfo={purchaseInfo}
        data={data[selectedOption]}
        username={session?.user.username}
        nickname={session?.user.nickname}
        userid={session?.user.id}
      />
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

  // Return
  return {
    props: { memberInfo },
  };
};

export default FincoinPurchaseGuide;
