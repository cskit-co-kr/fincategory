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
    console.log("filterCategories");
  };

  const handleSubmit = () => {
    filterCategories();
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
      window.scrollTo({
        top: 1110,
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
        top: 1110,
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
        className={`.sticky .top-0 .z-20 white-box max-[1023px]:!px-[16px] lg:pb-[20px] transition-all transform duration-150 overflow-hidden h-fit ${
          pageYOffset === false ? "" : `overflow-hidden !shadow-2xl !rounded-xl`
        } max-[1023px]:rounded-none max-[1023px]:shadow-none  ${
          mobileCategoryModal ? "!shadow-2xl !rounded-xl" : ""
        }`}
        // className={`sticky top-0 z-20 white-box lg:pb-[20px] transition-all transform duration-150 overflow-hidden ${
        //   pageYOffset === false
        //     ? "h-[68px] lg:h-[464px]"
        //     : `h-[68px] lg:h-[76px] overflow-hidden !shadow-2xl !rounded-xl`
        // } max-[1023px]:rounded-none max-[1023px]:shadow-none`}
      >
        <div
          className={`transition-all transform duration-150 ${
            pageYOffset === false
              ? "h-[68px] lg:h-[464px]"
              : `h-[68px] lg:h-[76px]`
          }`}
        >
          <div
            className="flex items-center justify-between gap-[10px] border-b border-[#e5e5e5] pt-[16px] pb-[16px] 
      lg:pt-[20px] lg:pb-[19px] lg:px-[10px]"
          >
            <div className="flex items-center gap-3 min-h-[36px]">
              <Image
                onClick={
                  window.innerWidth < 1024 ? showMobileCategory : undefined
                }
                src={"/img/FadersHorizontal.svg"}
                alt="FadersHorizontal"
                width={20}
                height={20}
              />
              <div className="font-bold">
                {/* 카테고리 */}
                {t["category"]}
              </div>
              |
              <button
                onClick={() => handleSelectTag("", "")}
                className={`rounded-xl font-bold px-4 py-[1px] border hover:underline ${
                  selectedTag || selectedCategory
                    ? "bg-white text-black border-[#e5e5e5]"
                    : "bg-primary border-primary text-white"
                }`}
              >
                {/* 전체 */}
                {t["All"]}
              </button>
              {selectedCategory && (
                <div className="flex items-center gap-2 font-bold">
                  <TbMathGreater size={12} />
                  <div className="bg-primary border border-primary rounded-xl text-white pl-1 pr-2 py-[1px] flex items-center gap-2">
                    <span className="bg-[#d9d9d9] rounded-xl text-black px-2 py-0.5 text-[10px]">
                      {selectedCategory[0].total}
                    </span>
                    {selectedCategory[0].label}
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
                <RxPinTop /> 맨위로
              </button>
            </div>
          </div>
          <div className="lg:grid grid-rows-8 grid-cols-5 gap-y-[4px] gap-x-[4px] grid-flow-col hidden mt-[20px]">
            {filteredCategories.map((category: any, index: number) => (
              <button
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

                <span> {JSON.parse(category.category_name)[locale]}</span>
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
            <div>
              <div className="relative border mt-[16px] border-primary items-center py-[7px] px-[11px] rounded-full inline-flex hover:shadow-md">
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
              <div className="bg-white pb-[20px] pt-[16px] rounded-lg w-full max-h-[60svh] .max-h-[544px] overflow-y-auto">
                <div className="flex flex-col gap-[4px] lg:hidden">
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
                      <span>{JSON.parse(category.category_name)[locale]}</span>
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
