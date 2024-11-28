import React from "react";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import apiService from "../../lib/apiService";
import { Notification, useToaster } from "rsuite";
import Image from "next/image";

const ModalFincoinPurchaseConfirm = ({
  purchaseInfo,
  data,
  username,
  nickname,
  userid,
}: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const toaster = useToaster();

  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let hour = d.getHours();
  let minute = d.getMinutes();
  const date = `${year}-${`00${month}`.slice(-2)}-${`00${day}`.slice(
    -2
  )} ${`00${hour}`.slice(-2)}:${`00${minute}`.slice(-2)}`;

  const submitPurchase = async () => {
    const d = {
      sender_name: purchaseInfo.name,
      sender_email: purchaseInfo.email,
      sender_phone: purchaseInfo.phone,
      coin: data.col1,
      coin_transit: data.col4,
      user_id: userid,
    };
    const result = await apiService.savePurchaseTransaction(d);
    if (result.code === 201) {
      const modal = document.getElementById("my_modal_1") as any;
      modal?.close();

      const message = (
        <Notification type="info" closable>
          <div className="flex items-center gap-2">
            <Image src="/party.svg" width={24} height={24} alt="Success" />
            핀코인 구매 완료하였습니다.
          </div>
        </Notification>
      );

      toaster.push(message, { placement: "topCenter" });
    }
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <div className="text-xl font-bold text-center">구매내용 확인</div>
        <div className="mt-5 max-w-[690px] border border-gray-100 rounded-lg mx-auto grid">
          <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
            <div className="font-semibold">구매일시:</div>
            <div>{date}</div>
          </div>
          <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
            <div className="font-semibold">구매자 ID / {t["nickname"]}:</div>
            <div>
              {username} / {nickname}
            </div>
          </div>
          <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
            <div className="font-semibold">구입 할 핀코인:</div>
            <div>{data.col1.toLocaleString()} FinCoin</div>
          </div>
          <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
            <div className="font-semibold">입금액:</div>
            <div>{data.col4.toLocaleString()}원 (부가세 포함)</div>
          </div>
          <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
            <div className="font-semibold">입금 계좌번호:</div>
            <div>신한은행 110 390 632138 조승기</div>
          </div>
          <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
            <div className="font-semibold">입금자 명:</div>
            <div>{purchaseInfo.name}</div>
          </div>
          <div className="px-5 py-2.5 border-b border-gray-100 font-semibold">
            입금 오류 발생시 연락할 연락처 또는 이메일 주소
          </div>
          <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
            <div className="font-semibold">연락처:</div>
            <div>{purchaseInfo.phone}</div>
          </div>
          <div className="grid grid-cols-2 px-5 py-3.5 border-b border-gray-100">
            <div className="font-semibold">이메일 주소:</div>
            <div>{purchaseInfo.email}</div>
          </div>
          <div className="mx-auto flex items-center gap-2 my-5">
            <form method="dialog">
              <button className="gray-button">취소</button>
            </form>
            <button className="blue-button" onClick={submitPurchase}>
              입금완료
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFincoinPurchaseConfirm;
