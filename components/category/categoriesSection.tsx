import { useRouter } from "next/router";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useState, useEffect } from "react";
import { LuSettings2 } from "react-icons/lu";
import { TbMathGreater } from "react-icons/tb";
import { RxPinTop } from "react-icons/rx";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const CategoriesSection = ({
  // tags,
  // selectedTag,
  // setSelectedTag,
  selectedCategory,
  setSelectedCategory,
  // selectCategory,
  // setSelectCategory,
  searchListRef,
  isRank,
  categories,
  searchResult,
}: any) => {
  // console.log("searchResult", searchResult);
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const [pageYOffset, setPageYOffset] = useState<any>(false);

  const [searchField, setSearchField] = useState("");
  const [mobileCategoryModal, setMobileCategoryModal] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(categories);

  // const handleKeyDown = (e: any) => {
  //   // if (e.key === "Enter") {
  //   handleSubmit();
  //   // }
  // };

  const filterCategories = (value: any) => {
    // console.log("value", value);
    const filtered = categories.filter((category: any) =>
      JSON.parse(category.category_name)
        [locale]?.toLowerCase()
        // .includes(searchField.toLowerCase())
        .includes(value?.toLowerCase())
    );
    setFilteredCategories(filtered);
    // console.log("filterCategories");
  };

  const handleSubmit = (e?: any) => {
    const value = e?.target?.value || ""; // Use empty string as default if undefined or null
    console.log("e?.target?.value", value);
    filterCategories(value);

    if (pageYOffset && mobileCategoryModal === false) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Re-filter categories when `categories`, `locale`, or `searchField` changes
    filterCategories("");
  }, [categories]);

  // const handleScroll = () => {
  //   console.log("window.scrollY", window.scrollY);
  //   if (window.scrollY > 180) {
  //     pageYOffset !== true ? setPageYOffset(true) : null;
  //   } else if (window.scrollY > 10) {
  //     pageYOffset !== true ? setPageYOffset(true) : null;
  //   } else {
  //     pageYOffset !== false ? setPageYOffset(false) : null;
  //   }
  // };

  const handleScroll = () => {
    // console.log("window.scrollY", window.scrollY);
    // console.log("searchResult?.length", searchResult?.length);

    // Check if screen height is within the specified range (1064px to 1480px)
    // if (window.innerHeight > 1064 && window.innerHeight < 1480) {
    //   pageYOffset !== false ? setPageYOffset(false) : null;
    //   // Don't trigger setPageYOffset(true) in this screen height range
    //   return;
    // }

    if (searchResult?.length < 6) {
      pageYOffset !== false ? setPageYOffset(false) : null;
      // return;
    } else {
      if (window.scrollY > 180 || window.scrollY > 10) {
        pageYOffset !== true ? setPageYOffset(true) : null;
      } else {
        pageYOffset !== false ? setPageYOffset(false) : null;
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageYOffset, searchResult]);

  // const handleSelectTag = (tag: any, category: any) => {
  //   // setSelectedTag(tag);
  //   // setSelectCategory(category.name);
  //   setSelectedCategory(null);
  //   if (isRank) {
  //     window.scrollTo({
  //       top: 100,
  //       behavior: "smooth",
  //     });
  //   } else {
  //     // window.scrollTo({
  //     //   top: 1110,
  //     //   behavior: "smooth",
  //     // });
  //     window.scrollTo({
  //       top: 500,
  //       behavior: "smooth",
  //     });
  //   }
  //   //searchListRef?.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  const handleCategoryClose = (tag: any, category: any) => {
    // setSelectedTag(tag);
    // setSelectCategory(category.name);
    setSelectedCategory(null);
    handleSubmit(null);
    setSearchField("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSelectCategory = (category: any) => {
    setSelectedCategory(category);
    // setSelectedTag("");
    // setSelectCategory("");
    setMobileCategoryModal(false);
    if (isRank) {
      window.scrollTo({
        top: 100,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 500,
        behavior: "smooth",
      });
    }
    //searchListRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showMobileCategory = () => {
    setMobileCategoryModal((prev) => !prev);
  };

  return (
    <div
      className={`top-0 z-20 ${mobileCategoryModal ? "px-[16px]" : ""}  ${
        pageYOffset === false ? "" : `sticky`
      }`}
    >
      <div
        className={`white-box border-none lg:border border-gray-secondary max-[1023px]:!px-[16px] transition-all transform duration-150 overflow-hidden h-fit ${
          pageYOffset === false
            ? ""
            : `overflow-hidden categorySec-boxShadow rounded-xl border-none`
        } max-[1023px]:rounded-none max-[1023px]:shadow-none  ${
          mobileCategoryModal ? "categorySec-boxShadow !rounded-xl" : ""
        }`}
      >
        <div
          className={`transition-all transform duration-150 lg:pb-[19px] ${
            pageYOffset === false ? "h-[68px] lg:h-fit" : `h-[68px] lg:h-[76px]`
          }`}
        >
          <div
            className={`flex items-center justify-between gap-[10px] border-gray-secondary pt-[16px] pb-[16px] 
            lg:py-[19px] lg:px-[10px] ${
              pageYOffset === false ? "border-b" : `border-b-[0px]`
            }  overflow-x-auto whitespace-nowrap`}
          >
            <div className="flex items-center gap-[8px] min-h-[36px] font-semibold pr-3 lg:pr-0">
              <Image
                onClick={
                  window.innerWidth < 1024 ? showMobileCategory : undefined
                }
                src={"/img/FadersHorizontal.svg"}
                alt="FadersHorizontal"
                width={20}
                height={20}
              />
              <div className="">
                {/* 카테고리 */}
                {t["category"]}
              </div>
              |
              <button
                // onClick={() => handleSelectTag("", "")}
                onClick={() => handleCategoryClose("", "")}
                className={`min-w-[52.2px] rounded-[28px] px-[11px] py-[3px] border hover:underline text-[12px] ${
                  selectedCategory
                    ? "bg-white text-black border-[#E7EAED]"
                    : "bg-primary border-primary text-white"
                }`}
              >
                {/* 전체 */}
                {t["All"]}
              </button>
              {selectedCategory && (
                <div className="flex items-center gap-[10px]">
                  {/* <TbMathGreater size={20} /> */}
                  <Image
                    className="min-h-[20px] min-w-[20px]"
                    src={"/img/CaretRight.svg"}
                    width={20}
                    height={20}
                    alt="CaretRight"
                  />
                  <div className="bg-gray-primary border border-blue-primary rounded-[40px] text-dark-primary px-[11px] py-[3px] flex items-center gap-[8px]">
                    {selectedCategory[0]?.image_path ? (
                      <Image
                        className="max-h-[20px] max-w-[20px]"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/getImage?image_path=${selectedCategory[0]?.image_path}`}
                        alt="image_path"
                        height={20}
                        width={20}
                      />
                    ) : null}
                    <span className=""> {selectedCategory[0].label}</span>
                    <span className="text-gray-text">
                      ({selectedCategory[0].total})
                    </span>
                    <Image
                      className="w-[16px] min-w-[16px] min-h-[16px] cursor-pointer"
                      src="/img/close_icon_grey.svg"
                      width={16}
                      height={16}
                      alt="close_icon_grey"
                      onClick={() => handleCategoryClose("", "")}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-[10px]">
              {/* <div
                className="relative border border-gray-3 items-center py-[7px] px-[11px] rounded-full hidden 
              lg:inline-flex hover:shadow-md hover:border-primary"
              >
                <button className="h-fit" onClick={handleSubmit} name="search">
                  <MagnifyingGlassIcon className="h-5 hover:text-primary text-gray-text mr-2" />
                </button>
                <input
                  type="text"
                  name="search"
                  value={searchField}
                  // onChange={(e) => {
                  //   setSearchField(e.target.value);
                  // }}
                  // onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setSearchField(e.target.value);
                    handleSubmit(e);
                  }}
                  className="outline-none w-24 md:w-[300px] lg:w-[348px] text-sm category-search-input"
                  aria-label="Search"
                  placeholder="Search"
                />
              </div> */}
              <button
                className={`flex items-center justify-center w-[65px] gap-[8px] text-[12px] bg-[#EBEAEA] rounded-full hover:underline my-[5px] ml-[12px] max-h-[24px] font-semibold
                ${pageYOffset === false && "hidden"}`}
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                >
                  <path
                    d="M1 3.9375L3.5 1.4375L6 3.9375"
                    stroke="#1C1E21"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.5 8.5625V1.5625"
                    stroke="#1C1E21"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {/* <RxPinTop />  */}
                {t["맨위로"]}
              </button>
              {mobileCategoryModal && (
                <button onClick={showMobileCategory}>
                  <Image
                    src={"/img/close_icon.svg"}
                    width={20}
                    height={20}
                    className="min-w-[20px] min-h-[20px]"
                    alt="close_icon"
                  />
                </button>
              )}
            </div>
          </div>

          {/* DESKTOP SEARCH */}
          <div
            className="relative border border-gray-3 items-center py-[9px] px-[11px] rounded-full hidden  w-full
              lg:inline-flex hover:shadow-md hover:border-primary mt-[12px]"
          >
            <button
              className="h-fit"
              // onClick={handleSubmit}
              name="search"
            >
              <MagnifyingGlassIcon className="h-5 hover:text-primary text-gray-text mr-2" />
            </button>
            <input
              type="text"
              name="search"
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
                handleSubmit(e);
              }}
              className="outline-none w-full text-sm category-search-input"
              aria-label="Search"
              placeholder="Category Search"
            />
          </div>
          <div className="lg:grid .grid-rows-8 .grid-flow-col grid-cols-5 gap-y-[3px] gap-x-[4px] grid-flow-row hidden mt-[12px]">
            {filteredCategories.map((category: any, index: number) => (
              <button
                onClick={() =>
                  handleSelectCategory([
                    {
                      value: category.category_id,
                      label: JSON.parse(category.category_name)[locale],
                      total: category.channel_count,
                      image_path: category?.image_path,
                    },
                  ])
                }
                className="flex flex-row items-center gap-[8px] py-[8px] px-[10px] max-h-[40px] text-left leading-[18px]"
              >
                {category?.image_path ? (
                  <Image
                    className="w-[20px] h-[20px] max-h-[20px] max-w-[20px]"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/getImage?image_path=${category?.image_path}`}
                    alt="image_path"
                    height={20}
                    width={20}
                  />
                ) : JSON.parse(category.category_name)["en"] === "N/A" ? (
                  <Image
                    className="w-[20px] h-[20px] max-h-[20px] max-w-[20px]"
                    src={`/img/n_a_category.png`}
                    alt="image_path"
                    height={20}
                    width={20}
                  />
                ) : (
                  <div className="w-[20px] h-[20px]"></div>
                )}

                {/* <span> {JSON.parse(category.category_name)[locale]}</span> */}
                <span>
                  {category.category_name &&
                  JSON.parse(category.category_name)[locale]
                    ? JSON.parse(category.category_name)
                        [locale].charAt(0)
                        .toUpperCase() +
                      JSON.parse(category.category_name)[locale].slice(1)
                    : ""}
                </span>
                <span className="text-gray-text">
                  ({category?.channel_count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Modal */}
        {mobileCategoryModal && (
          <>
            <div className="z-20 bg-black bg-opacity-50 flex items-center justify-center"></div>
            {/* Modal Content */}
            <div className="lg:hidden w-full">
              <div
                className="inline-flex relative w-full max-w-[400px] border mt-[16px] border-gray-text items-center py-[7px] px-[11px] rounded-full
              hover:shadow-md hover:border-primary"
              >
                <button
                  className="h-fit"
                  // onClick={handleSubmit}
                  name="search"
                >
                  <MagnifyingGlassIcon className="h-5 text-gray-text hover:text-primary mr-2" />
                </button>
                <input
                  type="text"
                  name="search"
                  value={searchField}
                  // onChange={(e) => setSearchField(e.target.value)}
                  // onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setSearchField(e.target.value);
                    handleSubmit(e);
                  }}
                  className="outline-none w-24 md:w-[300px] lg:w-[348px] text-sm category-search-input"
                  aria-label="Search"
                  placeholder="Search"
                />
              </div>
              {/* mobile categories */}
              <div className="bg-white pb-[20px] pt-[16px] rounded-lg w-full max-h-[60svh] overflow-y-auto">
                <div className="flex flex-col gap-[4px]">
                  {filteredCategories.map((category: any, index: number) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleSelectCategory([
                          {
                            value: category.category_id,
                            label: JSON.parse(category.category_name)[locale],
                            total: category.channel_count,
                          },
                        ])
                      }
                      className="flex flex-row items-center gap-[8px] py-[8px] px-[10px] max-h-[40px] text-left leading-[18px] rounded-[8px] hover:bg-gray-primary"
                    >
                      {category?.image_path ? (
                        <Image
                          className="w-[20px] h-[20px] max-h-[20px] max-w-[20px]"
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/getImage?image_path=${category?.image_path}`}
                          alt="image_path"
                          height={20}
                          width={20}
                        />
                      ) : JSON.parse(category.category_name)["en"] === "N/A" ? (
                        <Image
                          className="w-[20px] h-[20px] max-h-[20px] max-w-[20px]"
                          src={`/img/n_a_category.png`}
                          alt="image_path"
                          height={20}
                          width={20}
                        />
                      ) : (
                        <div className="w-[20px] h-[20px]"></div>
                      )}
                      {/* <span>{JSON.parse(category.category_name)[locale]}</span> */}
                      <span>
                        {category.category_name &&
                        JSON.parse(category.category_name)[locale]
                          ? JSON.parse(category.category_name)
                              [locale].charAt(0)
                              .toUpperCase() +
                            JSON.parse(category.category_name)[locale].slice(1)
                          : ""}
                      </span>
                      <span className="text-gray-text">
                        ({category?.channel_count})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Close Button */}
                {/* <button
                  onClick={() => setMobileCategoryModal(false)}
                  className="mt-4 text-red-500"
                >
                  Close
                </button> */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriesSection;
