import { useRouter } from "next/router";
import { koKR } from "../../lang/ko-KR";
import { enUS } from "../../lang/en-US";
import { Loader, SelectPicker } from "rsuite";
import { ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import {
  HiOutlineMegaphone,
  HiOutlineUsers,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { RiCloseCircleFill } from "react-icons/ri";

import { useEffect, useState } from "react";
import { Dropdown, Menu, Button } from "antd";
import Image from "next/image";

const SearchFilterBar = ({
  totalChannels,
  doFilter,
  selectedSorting,
  setSelectedSorting,
  loadBar,
  channelType,
  setChannelType,
  selectedTag,
  handleClick,
  doSearch,
  viewPort,
  setViewPort,
  selectedCategory,
}: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;

  type SortingOption = {
    label: string;
    value: string;
  };

  const data: SortingOption[] = [
    {
      label: `${t["subscribers-desc"]} ↓`,
      value: "subscription_desc",
    },
    {
      label: `${t["subscribers-asc"]} ↑`,
      value: "subscription_asc",
    },
    {
      label: `${t["today-desc"]}`,
      value: "today_desc",
    },
    {
      label: `${t["today-asc"]}`,
      value: "today_asc",
    },
    {
      label: `${t["total-desc"]}`,
      value: "total_desc",
    },
    {
      label: `${t["total-asc"]}`,
      value: "total_asc",
    },
    {
      label: `${t["created-desc"]}`,
      value: "created_desc",
    },
  ];

  const handleChange = (e: any) => {
    setSelectedSorting(e);
    doFilter(e);
  };

  const updateChannelType = (type: any) => {
    setChannelType(type);
    setChannelType((state: any) => {
      return state;
    });
  };
  const [firstCall, setFirstCall] = useState(true);

  useEffect(() => {
    !firstCall && doSearch((router.query.q as string) || "");
    setFirstCall(false);
  }, [channelType]);

  const menuItems = [
    {
      key: "all",
      label: t["All-cumulative"],
      icon: null,
      action: () => {
        updateChannelType([{ value: "all", label: t["All-cumulative"] }]);
        setDropdownVisible(!dropdownVisible);
      },
      isActive: channelType[0].value === "all",
    },
    {
      key: "channel",
      label: t["channel"],
      icon: <HiOutlineMegaphone />,
      action: () => {
        updateChannelType([{ value: "channel", label: t["channel"] }]);
        setDropdownVisible(!dropdownVisible);
      },
      isActive: channelType[0].value === "channel",
    },
    {
      key: "public_group",
      label: t["Public Group"],
      icon: <HiOutlineUsers />,
      action: () => {
        updateChannelType([
          { value: "public_group", label: t["public-group"] },
        ]);
        setDropdownVisible(!dropdownVisible);
      },
      isActive: channelType[0].value === "public_group",
    },
    // {
    //   key: "private_group",
    //   label: t["Private Group"],
    //   icon: <HiOutlineLockClosed />,
    //   action: () => {
    //     updateChannelType([
    //       { value: "private_group", label: t["private-group"] },
    //     ]);
    //     setDropdownVisible(!dropdownVisible);
    //   },
    //   isActive: channelType[0].value === "private_group",
    // },
  ];
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleDropdownVisibleChange = (visible: boolean) => {
    setDropdownVisible(visible);
  };

  // console.log("selectedCategory[0].label", selectedCategory[0].label);
  // console.log("selectedSorting", selectedSorting);
  return (
    <>
      <div className="sorting flex items-center w-full bg-white md:rounded-xl p-3 md:p-4 border border-gray-secondary">
        {/* Mobile Dropdown menu */}
        <div className="md:hidden">
          <Dropdown
            open={dropdownVisible}
            onOpenChange={handleDropdownVisibleChange}
            trigger={["click"]}
            dropdownRender={() => (
              <div className="flex flex-col w-[200px] px-[16px] py-[12px] gap-[10px] bg-white rounded-[8px] dropdown-boxShadow">
                {menuItems.map(({ key, label, icon, action, isActive }) => (
                  <button
                    key={key}
                    onClick={action}
                    className={`flex items-center text-[13px] font-semibold rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
                      isActive
                        ? "bg-primary border-primary text-white"
                        : "border-gray-200 text-dark-primary"
                    }`}
                  >
                    {icon && (
                      <span
                        className={`${
                          isActive ? "text-white" : "text-[#3886E2]"
                        }`}
                      >
                        {icon}
                      </span>
                    )}
                    {label}
                    {/* {t[label]} */}
                  </button>
                ))}
                <SelectPicker
                  value={selectedSorting}
                  onChange={handleChange}
                  name="sorting"
                  data={data}
                  cleanable={false}
                  searchable={false}
                  size="sm"
                  placement="bottomEnd"
                  renderValue={(value, item) => (
                    <span style={{ fontWeight: "600" }}>
                      {(item as SortingOption)?.label}
                    </span>
                  )}
                  renderMenuItem={(label, item) => (
                    <span style={{ fontWeight: "600" }}>{label}</span>
                  )}
                />
              </div>
            )}
            placement="bottom"
            arrow
          >
            <Button className="flex px-[16px] py-[8px] rounded-[8px] gap-[8px] border-[#E7EAED] border h-fit font-segoe">
              <Image
                src="/img/FunnelSimple.svg"
                className="max-w-[20px] max-h-[20px]"
                alt="FunnelSimple"
                width={20}
                height={20}
              />
              Filter
            </Button>
          </Dropdown>
        </div>
        {/*  */}
        {/* Desktop channel type buttons */}
        <div className="hidden md:flex gap-2 items-center font-semibold">
          <button
            className={`flex items-center text-[13px] rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
              channelType[0].value === "all"
                ? "bg-primary border-primary text-white"
                : "border-gray-200"
            }`}
            onClick={() =>
              updateChannelType([{ value: "all", label: t["All"] }])
            }
          >
            {t["All"]}
          </button>
          <button
            className={`flex items-center text-[13px] rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
              channelType[0].value === "channel"
                ? "bg-primary border-primary text-white"
                : "border-gray-200"
            }`}
            onClick={() =>
              updateChannelType([{ value: "channel", label: t["channel"] }])
            }
          >
            <HiOutlineMegaphone
              size={16}
              className={`${
                channelType[0].value === "channel"
                  ? "text-white"
                  : "text-[#3886E2]"
              }`}
            />
            {t["channel"]}
          </button>
          <button
            className={`flex items-center text-[13px] rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
              channelType[0].value === "public_group"
                ? "bg-primary border-primary text-white"
                : "border-gray-200"
            }`}
            onClick={() =>
              updateChannelType([
                { value: "public_group", label: t["public-group"] },
              ])
            }
          >
            <HiOutlineUsers
              size={16}
              className={`${
                channelType[0].value === "public_group"
                  ? "text-white"
                  : "text-[#FF7171]"
              }`}
            />
            {t["Public Group"]}
          </button>
          {/* <button
            className={`flex items-center text-[13px] rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
              channelType[0].value === "private_group"
                ? "bg-primary border-primary text-white"
                : "border-gray-200"
            }`}
            onClick={() =>
              updateChannelType([
                { value: "private_group", label: t["private-group"] },
              ])
            }
          >
            <HiOutlineLockClosed
              size={16}
              className={`${
                channelType[0].value === "private_group"
                  ? "text-white"
                  : "text-[#FF7171]"
              }`}
            />
            {t["Private Group"]}
          </button> */}
        </div>
        {/*  */}
        {/* Desktop sorting */}
        <div className="ml-auto hidden md:flex items-center">
          <span className="hidden md:inline-flex mr-2">{t["sort-by"]}</span>
          <SelectPicker
            value={selectedSorting}
            onChange={handleChange}
            name="sorting"
            data={data}
            cleanable={false}
            searchable={false}
            size="sm"
            placement="bottomEnd"
            menuStyle={{ fontWeight: "600" }}
            renderValue={(value, item) => (
              <span style={{ fontWeight: "600" }}>
                {(item as SortingOption)?.label}
              </span>
            )}
            renderMenuItem={(label, item) => (
              <span style={{ fontWeight: "600" }}>{label}</span>
            )}
          />
        </div>
        {/*  */}

        {/*Mobile Change Button for card display type */}
        <div className="md:hidden flex items-center gap-[12px] ml-auto">
          <button
            className={`flex justify-center items-center gap-[8px] rounded-full px-[8px] py-[4px]
          ${viewPort === "list" ? "bg-primary text-white" : "bg-[#EBEAEA]"}`}
            // onClick={() => setViewPort("list")}
          >
            {t["List"]}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="13"
              viewBox="0 0 17 13"
              fill="none"
            >
              <path
                d="M5.53125 2.125H15.5312M5.53125 6.5H15.5312M5.53125 10.875H15.5312M1.78125 2.125H1.78708V2.13167H1.78125V2.125ZM2.09375 2.125C2.09375 2.20788 2.06083 2.28737 2.00222 2.34597C1.94362 2.40458 1.86413 2.4375 1.78125 2.4375C1.69837 2.4375 1.61888 2.40458 1.56028 2.34597C1.50167 2.28737 1.46875 2.20788 1.46875 2.125C1.46875 2.04212 1.50167 1.96263 1.56028 1.90403C1.61888 1.84542 1.69837 1.8125 1.78125 1.8125C1.86413 1.8125 1.94362 1.84542 2.00222 1.90403C2.06083 1.96263 2.09375 2.04212 2.09375 2.125ZM1.78125 6.5H1.78708V6.50667H1.78125V6.5ZM2.09375 6.5C2.09375 6.58288 2.06083 6.66237 2.00222 6.72097C1.94362 6.77958 1.86413 6.8125 1.78125 6.8125C1.69837 6.8125 1.61888 6.77958 1.56028 6.72097C1.50167 6.66237 1.46875 6.58288 1.46875 6.5C1.46875 6.41712 1.50167 6.33763 1.56028 6.27903C1.61888 6.22042 1.69837 6.1875 1.78125 6.1875C1.86413 6.1875 1.94362 6.22042 2.00222 6.27903C2.06083 6.33763 2.09375 6.41712 2.09375 6.5ZM1.78125 10.875H1.78708V10.8817H1.78125V10.875ZM2.09375 10.875C2.09375 10.9579 2.06083 11.0374 2.00222 11.096C1.94362 11.1546 1.86413 11.1875 1.78125 11.1875C1.69837 11.1875 1.61888 11.1546 1.56028 11.096C1.50167 11.0374 1.46875 10.9579 1.46875 10.875C1.46875 10.7921 1.50167 10.7126 1.56028 10.654C1.61888 10.5954 1.69837 10.5625 1.78125 10.5625C1.86413 10.5625 1.94362 10.5954 2.00222 10.654C2.06083 10.7126 2.09375 10.7921 2.09375 10.875Z"
                stroke={`${viewPort === "list" ? "white" : "#1C1E21"}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={`flex justify-center items-center gap-[8px] rounded-full px-[8px] py-[4px]
          ${viewPort === "grid" ? "bg-primary text-white" : "bg-[#EBEAEA]"}`}
            // onClick={() => setViewPort("grid")}
          >
            {t["Card"]}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
            >
              <path
                d="M1 1.86364C1 1.50198 1.14367 1.15513 1.3994 0.8994C1.65513 0.643669 2.00198 0.5 2.36364 0.5H3.72727C4.08893 0.5 4.43578 0.643669 4.69151 0.8994C4.94724 1.15513 5.09091 1.50198 5.09091 1.86364V3.22727C5.09091 3.58893 4.94724 3.93578 4.69151 4.19151C4.43578 4.44724 4.08893 4.59091 3.72727 4.59091H2.36364C2.00198 4.59091 1.65513 4.44724 1.3994 4.19151C1.14367 3.93578 1 3.58893 1 3.22727V1.86364ZM1 7.77273C1 7.41107 1.14367 7.06422 1.3994 6.80849C1.65513 6.55276 2.00198 6.40909 2.36364 6.40909H3.72727C4.08893 6.40909 4.43578 6.55276 4.69151 6.80849C4.94724 7.06422 5.09091 7.41107 5.09091 7.77273V9.13636C5.09091 9.49802 4.94724 9.84487 4.69151 10.1006C4.43578 10.3563 4.08893 10.5 3.72727 10.5H2.36364C2.00198 10.5 1.65513 10.3563 1.3994 10.1006C1.14367 9.84487 1 9.49802 1 9.13636V7.77273ZM6.90909 1.86364C6.90909 1.50198 7.05276 1.15513 7.30849 0.8994C7.56422 0.643669 7.91107 0.5 8.27273 0.5H9.63636C9.99802 0.5 10.3449 0.643669 10.6006 0.8994C10.8563 1.15513 11 1.50198 11 1.86364V3.22727C11 3.58893 10.8563 3.93578 10.6006 4.19151C10.3449 4.44724 9.99802 4.59091 9.63636 4.59091H8.27273C7.91107 4.59091 7.56422 4.44724 7.30849 4.19151C7.05276 3.93578 6.90909 3.58893 6.90909 3.22727V1.86364ZM6.90909 7.77273C6.90909 7.41107 7.05276 7.06422 7.30849 6.80849C7.56422 6.55276 7.91107 6.40909 8.27273 6.40909H9.63636C9.99802 6.40909 10.3449 6.55276 10.6006 6.80849C10.8563 7.06422 11 7.41107 11 7.77273V9.13636C11 9.49802 10.8563 9.84487 10.6006 10.1006C10.3449 10.3563 9.99802 10.5 9.63636 10.5H8.27273C7.91107 10.5 7.56422 10.3563 7.30849 10.1006C7.05276 9.84487 6.90909 9.49802 6.90909 9.13636V7.77273Z"
                stroke={`${viewPort === "grid" ? "white" : "#1C1E21"}`}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/*  */}
      </div>
      {/*  */}
      {/*  */}
      {/*  */}
      <div className="flex items-center px-4 md:p-0 gap-3">
        <div className="text-sm">
          {/* {`${t["total-search-results1"]} ${
            selectedCategory
              ? '"' + `${selectedCategory[0].label}` + '" '
              : router.query.q
              ? router.query.q
              : ""
          }: `} */}
          {`${t["total-search-results1"]} `}
          {selectedCategory ? (
            <>
              <span className="font-bold">"{selectedCategory[0].label}"</span>{" "}
            </>
          ) : router.query.q ? (
            <>{router.query.q} </>
          ) : (
            ""
          )}
          {`: `}
          {loadBar ? <Loader /> : <b>{totalChannels}</b>}
          {t["total-search-results2"]}
        </div>
        {router.query.q && (
          <button
            onClick={() => router.push("/")}
            className="hidden md:flex items-center gap-1 bg-white text-xs font-semibold rounded-full px-4 py-1 text-primary w-fit"
          >
            {/* 검색 취소 */}
            {t["Cancel search"]}
            <RiCloseCircleFill className="text-gray-400" />
          </button>
        )}

        {/* Change Button for card display type */}
        <div className="hidden md:flex items-center gap-[12px] ml-auto">
          <button
            className={`flex justify-center items-center gap-[8px] rounded-full px-[8px] py-[4px]
          ${viewPort === "list" ? "bg-primary text-white" : "bg-[#EBEAEA]"}`}
            // onClick={() => setViewPort("list")}
          >
            {t["List"]}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="13"
              viewBox="0 0 17 13"
              fill="none"
            >
              <path
                d="M5.53125 2.125H15.5312M5.53125 6.5H15.5312M5.53125 10.875H15.5312M1.78125 2.125H1.78708V2.13167H1.78125V2.125ZM2.09375 2.125C2.09375 2.20788 2.06083 2.28737 2.00222 2.34597C1.94362 2.40458 1.86413 2.4375 1.78125 2.4375C1.69837 2.4375 1.61888 2.40458 1.56028 2.34597C1.50167 2.28737 1.46875 2.20788 1.46875 2.125C1.46875 2.04212 1.50167 1.96263 1.56028 1.90403C1.61888 1.84542 1.69837 1.8125 1.78125 1.8125C1.86413 1.8125 1.94362 1.84542 2.00222 1.90403C2.06083 1.96263 2.09375 2.04212 2.09375 2.125ZM1.78125 6.5H1.78708V6.50667H1.78125V6.5ZM2.09375 6.5C2.09375 6.58288 2.06083 6.66237 2.00222 6.72097C1.94362 6.77958 1.86413 6.8125 1.78125 6.8125C1.69837 6.8125 1.61888 6.77958 1.56028 6.72097C1.50167 6.66237 1.46875 6.58288 1.46875 6.5C1.46875 6.41712 1.50167 6.33763 1.56028 6.27903C1.61888 6.22042 1.69837 6.1875 1.78125 6.1875C1.86413 6.1875 1.94362 6.22042 2.00222 6.27903C2.06083 6.33763 2.09375 6.41712 2.09375 6.5ZM1.78125 10.875H1.78708V10.8817H1.78125V10.875ZM2.09375 10.875C2.09375 10.9579 2.06083 11.0374 2.00222 11.096C1.94362 11.1546 1.86413 11.1875 1.78125 11.1875C1.69837 11.1875 1.61888 11.1546 1.56028 11.096C1.50167 11.0374 1.46875 10.9579 1.46875 10.875C1.46875 10.7921 1.50167 10.7126 1.56028 10.654C1.61888 10.5954 1.69837 10.5625 1.78125 10.5625C1.86413 10.5625 1.94362 10.5954 2.00222 10.654C2.06083 10.7126 2.09375 10.7921 2.09375 10.875Z"
                stroke={`${viewPort === "list" ? "white" : "#1C1E21"}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={`flex justify-center items-center gap-[8px] rounded-full px-[8px] py-[4px]
          ${viewPort === "grid" ? "bg-primary text-white" : "bg-[#EBEAEA]"}`}
            // onClick={() => setViewPort("grid")}
          >
            {t["Card"]}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
            >
              <path
                d="M1 1.86364C1 1.50198 1.14367 1.15513 1.3994 0.8994C1.65513 0.643669 2.00198 0.5 2.36364 0.5H3.72727C4.08893 0.5 4.43578 0.643669 4.69151 0.8994C4.94724 1.15513 5.09091 1.50198 5.09091 1.86364V3.22727C5.09091 3.58893 4.94724 3.93578 4.69151 4.19151C4.43578 4.44724 4.08893 4.59091 3.72727 4.59091H2.36364C2.00198 4.59091 1.65513 4.44724 1.3994 4.19151C1.14367 3.93578 1 3.58893 1 3.22727V1.86364ZM1 7.77273C1 7.41107 1.14367 7.06422 1.3994 6.80849C1.65513 6.55276 2.00198 6.40909 2.36364 6.40909H3.72727C4.08893 6.40909 4.43578 6.55276 4.69151 6.80849C4.94724 7.06422 5.09091 7.41107 5.09091 7.77273V9.13636C5.09091 9.49802 4.94724 9.84487 4.69151 10.1006C4.43578 10.3563 4.08893 10.5 3.72727 10.5H2.36364C2.00198 10.5 1.65513 10.3563 1.3994 10.1006C1.14367 9.84487 1 9.49802 1 9.13636V7.77273ZM6.90909 1.86364C6.90909 1.50198 7.05276 1.15513 7.30849 0.8994C7.56422 0.643669 7.91107 0.5 8.27273 0.5H9.63636C9.99802 0.5 10.3449 0.643669 10.6006 0.8994C10.8563 1.15513 11 1.50198 11 1.86364V3.22727C11 3.58893 10.8563 3.93578 10.6006 4.19151C10.3449 4.44724 9.99802 4.59091 9.63636 4.59091H8.27273C7.91107 4.59091 7.56422 4.44724 7.30849 4.19151C7.05276 3.93578 6.90909 3.58893 6.90909 3.22727V1.86364ZM6.90909 7.77273C6.90909 7.41107 7.05276 7.06422 7.30849 6.80849C7.56422 6.55276 7.91107 6.40909 8.27273 6.40909H9.63636C9.99802 6.40909 10.3449 6.55276 10.6006 6.80849C10.8563 7.06422 11 7.41107 11 7.77273V9.13636C11 9.49802 10.8563 9.84487 10.6006 10.1006C10.3449 10.3563 9.99802 10.5 9.63636 10.5H8.27273C7.91107 10.5 7.56422 10.3563 7.30849 10.1006C7.05276 9.84487 6.90909 9.49802 6.90909 9.13636V7.77273Z"
                stroke={`${viewPort === "grid" ? "white" : "#1C1E21"}`}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/*  */}
      </div>
      {router.query.q && (
        <button
          onClick={() => router.push("/")}
          className="md:hidden flex items-center gap-1 bg-white text-xs font-semibold rounded-full px-4 py-1 mb-4 ml-4 text-primary w-fit"
        >
          검색 취소
          <RiCloseCircleFill className="text-gray-400" />
        </button>
      )}
    </>
  );
};

export default SearchFilterBar;
