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
  tags,
  selectedTag,
  setSelectedTag,
  selectedCategory,
  setSelectedCategory,
  selectCategory,
  setSelectCategory,
  searchListRef,
  isRank,
  categories,
}: any) => {
  // console.log("categories", categories);
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const [pageYOffset, setPageYOffset] = useState<any>(false);

  const [searchField, setSearchField] = useState("");
  const [mobileCategoryModal, setMobileCategoryModal] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const filterCategories = () => {
    const filtered = categories.filter((category: any) =>
      JSON.parse(category.category_name)
        [locale]?.toLowerCase()
        .includes(searchField.toLowerCase())
    );
    setFilteredCategories(filtered);
    // console.log("filterCategories");
  };

  const handleSubmit = () => {
    filterCategories();
    if (pageYOffset) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Re-filter categories when `categories`, `locale`, or `searchField` changes
    filterCategories();
  }, [categories]);

  const handleScroll = () => {
    if (window.scrollY > 180) {
      pageYOffset !== true ? setPageYOffset(true) : null;
    } else if (window.scrollY > 10) {
      pageYOffset !== true ? setPageYOffset(true) : null;
    } else {
      pageYOffset !== false ? setPageYOffset(false) : null;
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageYOffset]);

  const handleSelectTag = (tag: any, category: any) => {
    setSelectedTag(tag);
    setSelectCategory(category.name);
    setSelectedCategory(null);
    if (isRank) {
      window.scrollTo({
        top: 100,
        behavior: "smooth",
      });
    } else {
      // window.scrollTo({
      //   top: 1110,
      //   behavior: "smooth",
      // });
      window.scrollTo({
        top: 500,
        behavior: "smooth",
      });
    }
    //searchListRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (category: any) => {
    setSelectedCategory(category);
    setSelectedTag("");
    setSelectCategory("");
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
      className={`sticky top-0 z-20 ${mobileCategoryModal ? "px-[16px]" : ""}`}
    >
      <div
        className={`white-box border-gray-secondary max-[1023px]:!px-[16px] transition-all transform duration-150 overflow-hidden h-fit ${
          pageYOffset === false
            ? ""
            : `overflow-hidden !shadow-2xl !rounded-xl border-none`
        } max-[1023px]:rounded-none max-[1023px]:shadow-none  ${
          mobileCategoryModal ? "!shadow-2xl !rounded-xl" : ""
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
            }`}
          >
            <div className="flex items-center gap-3 min-h-[36px] font-semibold">
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
                onClick={() => handleSelectTag("", "")}
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
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-[10px]">
              <div className="relative border border-primary items-center py-[7px] px-[11px] rounded-full hidden lg:inline-flex hover:shadow-md">
                <button className="h-fit" onClick={handleSubmit} name="search">
                  <MagnifyingGlassIcon className="h-5 text-primary mr-2" />
                </button>
                <input
                  type="text"
                  name="search"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="outline-none w-24 md:w-[300px] lg:w-[348px] text-sm category-search-input"
                  aria-label="Search"
                  placeholder="Search"
                />
              </div>
              <button
                className={`flex items-center gap-1 text-[11px] bg-gray-50 rounded-full pl-1 pr-2 py-0.5 hover:underline ${
                  pageYOffset === false && "hidden"
                }`}
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <RxPinTop /> {t["맨위로"]}
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
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M15.625 4.375L4.375 15.625"
                      stroke="#1C1E21"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.625 15.625L4.375 4.375"
                      stroke="#1C1E21"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg> */}
                </button>
              )}
            </div>
          </div>
          <div className="lg:grid .grid-rows-8 .grid-flow-col grid-cols-5 gap-y-[4px] gap-x-[6px] grid-flow-row hidden mt-[20px]">
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
                className="flex flex-row gap-[8px] p-[10px] max-h-[40px] text-left"
              >
                {category?.image_path ? (
                  <Image
                    className="max-h-[20px] max-w-[20px]"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/getImage?image_path=${category?.image_path}`}
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
                <span>({category?.channel_count})</span>
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
              <div className="relative border mt-[16px] border-primary items-center py-[7px] px-[11px] rounded-full inline-flex hover:shadow-md w-full max-w-[400px]">
                <button className="h-fit" onClick={handleSubmit} name="search">
                  <MagnifyingGlassIcon className="h-5 text-primary mr-2" />
                </button>
                <input
                  type="text"
                  name="search"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                      className="flex flex-row gap-[8px] p-[10px] max-h-[40px] text-left"
                    >
                      {category?.image_path ? (
                        <Image
                          className="max-h-[20px] max-w-[20px]"
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/getImage?image_path=${category?.image_path}`}
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
                      <span>({category?.channel_count})</span>
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
