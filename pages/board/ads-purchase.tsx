import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Sidebar from "../../components/member/Sidebar";
import Link from "next/link";

const FincoinPurchase = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/board/signin");
    },
  });

  const showModal = () => {
    const modal = document.getElementById("confirm") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("confirm") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <>
      <div className="flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        <div className="mx-auto w-full px-5 md:px-0 gap-4">
          <div className="white-box">
            <div className="text-xl font-bold">광고상품 구매</div>
            <div className="mt-[30px] space-y-5">
              <div className="flex items-center">
                <div className="w-1/4 font-semibold">{t["상품명"]}:</div>
                <div>(1m) Showing Channel on the Main Page</div>
              </div>

              <div className="flex items-center">
                <div className="w-1/4 font-semibold">제품 가격:</div>
                <div>200 000 Fincoin</div>
              </div>

              <div className="flex items-center">
                <div className="w-1/4 font-semibold">
                  {t["텔레그램 채널 ID"]}:
                </div>
                <div className="w-3/4 border border-gray-200 rounded-lg flex items-center">
                  <div className="bg-gray-50 px-4 py-2 rounded-l-lg">t.me/</div>
                  <input
                    type="text"
                    className="w-full px-5 py-2 rounded-r-lg"
                    placeholder="Input your channel name..."
                  />
                  <div className="whitespace-nowrap pr-3 text-xs text-gray-400">
                    Not Found!{" "}
                    <Link
                      href="/add"
                      target="_blank"
                      className="text-primary underline"
                    >
                      Click here
                    </Link>{" "}
                    to add your channel first.
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/4 font-semibold">사용자 지갑 잔액:</div>
                <div>180 000 Fincoin</div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  className="blue-button bg-white border-2 border-primary text-primary"
                  onClick={() => router.back()}
                >
                  취소
                </button>
                <button
                  className="blue-button border-2 border-primary"
                  onClick={showModal}
                >
                  구매
                </button>
                <dialog id="confirm" className="modal">
                  <div className="modal-box max-w-2xl">
                    <div className="text-xl font-bold text-center">
                      광고상품 구매
                    </div>
                    <div className="grid grid-cols-2 border border-gray-200 rounded-lg mt-7">
                      <div className="px-4 py-2.5 font-semibold border-b border-gray-200">
                        {t["상품명"]}:
                      </div>
                      <div className="px-4 py-2.5 border-b border-gray-200">
                        메인 페이지에 채널 표시하기
                      </div>
                      <div className="px-4 py-2.5 font-semibold border-b border-gray-200">
                        제품 가격:
                      </div>
                      <div className="px-4 py-2.5 border-b border-gray-200">
                        200,000 {t["핀코인"]}
                      </div>
                      <div className="px-4 py-2.5 font-semibold border-b border-gray-200">
                        텔레그램 채널 ID:
                      </div>
                      <div className="px-4 py-2.5 border-b border-gray-200">
                        comaps
                      </div>
                    </div>
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="blue-button bg-white border-2 border-primary text-primary">
                          취소
                        </button>
                      </form>
                      <button className="blue-button">구매</button>
                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FincoinPurchase;
