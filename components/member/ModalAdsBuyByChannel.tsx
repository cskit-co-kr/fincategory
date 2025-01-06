import { Loader, Notification, useToaster, Checkbox } from "rsuite";
import apiService from "../../lib/apiService";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { koKR } from "../../lang/ko-KR";
import { enUS } from "../../lang/en-US";
import AdChannel2 from "../../components/search/AdChannel2";
import { DatePicker } from "antd";
// import { DownOutlined } from "@ant-design/icons";

const ModalAdsPurchaseConfirm = ({
  ads2,
  balance,
  modalId,
  adsGroup,
  userId,
  channelDetail,
  fetchWallet,
}: any) => {
  // console.log("ads2", ads2);
  const toaster = useToaster();
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  const [lowBalance, setLowBalance] = useState<string | null>(null);
  const [channelError, setChannelError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [startDate, setStartDate] = useState<any | null>(null);
  // const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const extractUsername = (input: any) => {
    let arr = [];
    let text = "";

    if (input.includes("+")) {
      arr = input.split("+");
      text = arr.reverse()[0];
    } else if (input.includes("@")) {
      arr = input.split("@");
      text = arr.reverse()[0];
    } else if (input.includes("/")) {
      arr = input.split("/");
      text = arr.reverse()[0];
    } else {
      text = input;
    }
    return text;
  };
  // const checkUsername = async () => {
  //   if (channel !== "") {
  //     setCheckUsernameLoading(true);
  //     setCheckUser(null);
  //     setCheckChannel(null);
  //     setChannelError(null);
  //     const username = extractUsername(channel);
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/resolvechannel?username=${username}`
  //     );
  //     const data = await res.data;
  //     if (data.existed) {
  //       setCheckUser("Channel existed in our database!");
  //       setCheckChannel(data);
  //     } else {
  //       setCheckUser("입력하신 채널/그룹은 핀카에 없습니다. ");
  //     }
  //     setCheckUsernameLoading(false);
  //   }
  // };

  const submitPurchase = async (channel_id: any, ad2: any, startDate: any) => {
    // console.log("ad2", ad2);
    // console.log("channel_id", channel_id);
    // console.log("startDate", startDate);
    // console.log("ad2?.coin", ad2?.coin);
    // console.log("balance", balance);

    if (!channel_id || !ad2) {
      return setError("Please fill Period field!");
    } else {
      if (!startDate) {
        return setError("Please fill Start Date field!");
      } else {
        setError("");
      }
    }
    if (balance < ad2?.coin) {
      return setLowBalance(t["You don't have enough balance"]);
    } else {
      setLowBalance("");
      const date = new Date(startDate);

      // Set time to 00:00:00.000
      date.setHours(0, 0, 0, 0);

      // Convert the date to UTC
      const started_at_utcDate = new Date(date.toUTCString());

      const body = {
        product_info_id: ad2?.id,
        channel_id: channel_id,
        started_at: started_at_utcDate,
        user_id: userId,
      };

      // console.log("body", body);
      const result = await apiService.saveAdsPurchase(body);

      if (result.code === 400) {
        alert(t["Sold Out"]);
      } else if (result.code === 201) {
        const modal = document.getElementById(
          `${adsGroup}_modal_${modalId}`
        ) as any;
        modal?.close();

        const message = (
          <Notification type="info" closable>
            <div className="flex items-center gap-2">
              <Image src="/party.svg" width={24} height={24} alt="Success" />
              {t["Your purchase of the advertised product has been completed"]}
            </div>
          </Notification>
        );
        toaster.push(message, { placement: "topCenter" });

        setSelectedProduct(null);
        setStartDate(null);
        fetchWallet();
      }
    }
  };

  // const handleKeyDown = (e: any) => {
  //   if (e.key === "Enter") {
  //     checkUsername();
  //   }
  // };

  const handleAdSelection = (ad: any) => {
    setSelectedProduct(ad);
  };

  const handleDateChange = (date: any) => {
    setStartDate(date);
  };

  const disabledDate = (current: any) => {
    const today = new Date();
    // Reset time portion for today (set hours, minutes, and seconds to 0)
    today.setHours(0, 0, 0, 0);

    // Disable dates before today
    return current && current < today;
  };

  return (
    <dialog id={`${adsGroup}_modal_${modalId}`} className="modal">
      <div className="modal-box !max-w-[370px] pb-[30px] pt-[20px] px-[20px] sm:!max-w-[600px] sm:py-[30px] sm:px-[42px]">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute border-none right-[24px] top-[24px] text-[18px] !w-[20px] !h-[20px] !min-h-[20px]
          sm:!h-[30px] sm:!min-h-[30px] sm:!w-[30px] sm:text-[24px]"
          >
            ✕
          </button>
        </form>
        <div className="text-[20px] leading-[27px] sm:text-2xl font-bold text-center">
          {t["Channel Advertisement"]}
        </div>
        <div className="flex items-center justify-center pt-[24px] pb-[20px] sm:py-[24px]">
          <AdChannel2
            channel={channelDetail}
            key={modalId}
            showType={!!channelDetail.type}
            typeIcon={false}
            showCategory={true}
          />
        </div>
        <div className="mx-auto grid">
          <div className="flex flex-col gap-[4px]">
            <div className="font-semibold py-[4.5px] text-[16px] leading-[21px]">
              {t["Channel name"]}
            </div>
            <div className="flex items-center self-stretch px-3 bg-[#EBF3FD] text-blue-primary rounded-[8px] h-[45px]">
              <a
                href={`https://t.me/${
                  channelDetail.type === "private_group" ? "+" : ""
                }${channelDetail.username}`}
                target="_blank"
              >
                @{channelDetail.username}
              </a>
            </div>
          </div>
          <div className="flex flex-col mt-[24px] gap-[8px]">
            <div className="font-semibold text-[16px] leading-[19px]">
              {t["Period"]}
            </div>
            <div className="flex flex-row w-full justify-between gap-[18px] sm:gap-[30px]">
              <div className="flex flex-col gap-[8px]">
                {ads2.map((ad: any) => (
                  <div
                    key={ad.id}
                    className="flex items-center min-h-[31px] gap-[18px] sm:gap-[30px]"
                  >
                    <label className="flex flex-row gap-[11px]">
                      <input
                        className="w-[19px] h-[19px]"
                        type="radio"
                        name="ads"
                        value={ad.id}
                        checked={selectedProduct?.id === ad.id}
                        onChange={() => {
                          handleAdSelection(ad);
                        }}
                      />
                      <div className="flex flex-row gap-[18px] sm:gap-[30px]">
                        <div className="leading-[19px] sm:min-w-[112px] whitespace-pre">
                          {ad.duration} {t["month"]}
                        </div>
                        <div className="text-dark-primary text-[14px] leading-[19px] font-semibold sm:min-w-[122px] text-right whitespace-pre">
                          {ad.coin.toLocaleString()} coin
                        </div>
                      </div>
                    </label>
                    {selectedProduct?.id === ad.id && ( // Conditionally render the DatePicker
                      <div className=".grid sm:w-[192px] h-[31px]">
                        <DatePicker
                          value={startDate}
                          onChange={handleDateChange}
                          format="YYYY-MM-DD"
                          placeholder="Start date"
                          className="w-full h-full !z-[1050]"
                          disabledDate={disabledDate}
                          getPopupContainer={() =>
                            document.getElementById(
                              `${adsGroup}_modal_${modalId}`
                            )!
                          }
                          suffixIcon={
                            <Image
                              src={"/img/chevron_down.svg"}
                              width={12.3}
                              height={16}
                              className="max-w-[12.3px] max-h-[16px] h-[16px] margin-none"
                              alt="chevron_down"
                            />
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-[24px] gap-[4px]">
            <div className="font-semibold py-[5.5px] text-[16px] leading-[21px]">
              {t["My Balance"]}
            </div>
            <div
              className={`flex items-center justify-between rounded-md px-3 w-full bg-[#F3F3F3] h-[45px]
                ${lowBalance ? "border border-red-500" : ""}`}
            >
              <div className="flex flex-row gap-3 text-dark-primary font-normal">
                {" "}
                <Image
                  src={"/img/wallet.svg"}
                  alt="wallet"
                  width={19}
                  height={17}
                  className="max-w-[19px] h-max-[17px]"
                />
                {balance.toLocaleString()} coin
              </div>
              <Link
                href="/auth/fincoin-purchase"
                className="w-[27px] h-[27px] bg-white p-[6px] rounded-full"
              >
                {/* {t["핀코인 구매"]} */}
                <Image
                  src={"/img/plus.svg"}
                  alt="plus"
                  width={15}
                  height={15}
                  className="max-w-[15px] h-max-[15px]"
                />
              </Link>
            </div>
            {lowBalance && (
              <div className="text-red-500 italic text-xs">{lowBalance}</div>
            )}
            {error && (
              <div className="text-red-500 italic text-sm">{error}</div>
            )}
          </div>
          <div className="mt-[24px] leading-[22px] text-gray-text">
            {t["If you purchase a product,"]}
            <span className="text-dark-primary">
              {selectedProduct?.coin.toLocaleString()} coins
            </span>
            {
              t[
                "will be deducted from your coin holdings. Would you like to purchase?"
              ]
            }
          </div>
          <div className="mx-auto flex items-center gap-[12px] font-semibold leading-[20px] mt-[20px] sm:mt-[24px]">
            <form method="dialog">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setStartDate(null);
                }}
                className="rounded-full border border-gray-3 w-[107px] h-[40px] sm:h-[36px]"
              >
                {t["Cancel"]}
              </button>
            </form>
            <button
              disabled={
                !channelDetail.id || !selectedProduct || !startDate
                  ? true
                  : false
              }
              className={`rounded-full text-white w-[107px] h-[40px] sm:h-[36px] ${
                !channelDetail.id || !selectedProduct || !startDate
                  ? "bg-[#E1DEDE] cursor-not-allowed"
                  : "bg-blue-primary"
              }`}
              onClick={() =>
                submitPurchase(channelDetail.id, selectedProduct, startDate)
              }
            >
              {t["Purchase"]}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModalAdsPurchaseConfirm;
