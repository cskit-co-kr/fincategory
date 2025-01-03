import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Table, Pagination } from "rsuite";
import apiService from "../../lib/apiService";
import { useSession } from "next-auth/react";
import { toDateTimeformat } from "../../lib/utils";

const { Column, HeaderCell, Cell } = Table;

const PurchaseHistory = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/signin");
    },
  });
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState([]);
  const [pageTotal, setPageTotal] = useState(1);

  useEffect(() => {
    (async () => {
      if (session) {
        const result = await apiService.transactionListPurchase(
          session?.user.id,
          page
        );
        setData(result.data);
        setPageTotal(result.total);
      }
    })();
  }, [session, page]);

  return (
    <>
      <Table
        data={data}
        bordered
        className="wallet-table rounded-lg"
        autoHeight
        renderLoading={() => <div className="text-center py-10"></div>}
        renderEmpty={() => <div className="text-center py-10"></div>}
      >
        <Column width={160}>
          <HeaderCell>{t["일시"]}</HeaderCell>
          <Cell>{(rowData) => toDateTimeformat(rowData.created_at, "-")}</Cell>
        </Column>

        <Column width={120} align="center">
          <HeaderCell>{t["구입한 핀코인"]}</HeaderCell>
          <Cell>{(rowData) => rowData.coin.toLocaleString()}</Cell>
        </Column>

        <Column width={120} align="center">
          <HeaderCell>{t["입금액"]}</HeaderCell>
          <Cell>
            {(rowData) => (
              <>
                {rowData.coin_transit.toLocaleString()} {t["원"]}
              </>
            )}
          </Cell>
        </Column>

        <Column minWidth={170} flexGrow={1}>
          <HeaderCell>
            {t["입력한 연락처"]} / {t["email"]}
          </HeaderCell>
          <Cell>
            {(rowData) => (
              <>
                {rowData.sender_phone} / {rowData.sender_email}
              </>
            )}
          </Cell>
        </Column>

        <Column width={170} align="center">
          <HeaderCell>{t["입금자 명"]}</HeaderCell>
          <Cell>{(rowData) => rowData.sender_name}</Cell>
        </Column>

        <Column width={100} align="center">
          <HeaderCell>{t["상태"]}</HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData.state === "waiting") {
                return (
                  <div className="text-yellow-500 font-semibold">
                    {t["대기"]}
                  </div>
                );
              } else if (rowData.state === "success") {
                return (
                  <div className="text-green-500 font-semibold">
                    {t["입금완료"]}
                  </div>
                );
              } else if (rowData.state === "noincome") {
                return (
                  <div className="text-orange-500 font-semibold">
                    {t["미입금"]}
                  </div>
                );
              } else if (rowData.state === "return") {
                return (
                  <div className="text-red-500 font-semibold">{t["환불"]}</div>
                );
              }
            }}
          </Cell>
        </Column>
      </Table>
      <div className="p-5">
        <Pagination
          className="justify-center"
          prev
          next
          first
          last
          ellipsis
          maxButtons={5}
          total={pageTotal}
          activePage={page}
          onChangePage={setPage}
        />
      </div>
    </>
  );
};

export default PurchaseHistory;
