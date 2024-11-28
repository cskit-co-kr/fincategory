import { useRouter } from "next/router";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import { useState, useEffect } from "react";
import { LuSettings2 } from "react-icons/lu";
import { TbMenu2, TbMathGreater } from "react-icons/tb";
import { hashtagReduce } from "../lib/utils";

const HashtagMobile = ({
  tags,
  selectedTag,
  setSelectedTag,
  selectedCategory,
  setSelectedCategory,
  selectCategory,
  setSelectCategory,
  searchListRef,
  isRank,
}: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const [ispageYOffset, setIsPageYOffset] = useState<boolean>(false);

  const handleScroll = () => {
    if (window.scrollY === 0 && ispageYOffset === true) {
      setIsPageYOffset(false);
    } else if (ispageYOffset === false) {
      setIsPageYOffset(true);
    }
  };

  const [groupedTags, setGroupedTags] = useState<any>([]);

  useEffect(() => {
    const reduceTags = hashtagReduce(tags);

    setGroupedTags(reduceTags);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ispageYOffset]);

  const handleSelectTag = (tag: any, category: any) => {
    setSelectedCategory(null);
    handleClick();
    setSelectedTag(tag);
    setSelectCategory(category.name);
    if (!isRank)
      window.scrollTo({
        top: 2280,
        behavior: "smooth",
      });
    //searchListRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  function handleClick() {
    const element = document.getElementById("my-drawer");
    if (element) {
      element.click();
    }
  }

  const handleSelectCategory = (category: any) => {
    setSelectedCategory(category);
    handleClick();
    setSelectedTag("");
    setSelectCategory("");
    if (!isRank)
      window.scrollTo({
        top: 2280,
        behavior: "smooth",
      });
    //searchListRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`drawer sticky top-0 z-20 lg:hidden bg-gray-50 ${
        ispageYOffset === true ? "shadow-xl" : "shadow-none"
      }`}
    >
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content w-screen">
        {/* Page content here */}
        <div className="flex items-center  w-full border-b border-[#e5e5e5] mt-4 px-4 pb-4">
          <label htmlFor="my-drawer" className="mr-4">
            <TbMenu2 size={24} />
          </label>
          <button
            onClick={() => handleSelectTag("", "")}
            className={`rounded-xl font-bold px-4 mr-3 py-[1px] border hover:underline whitespace-nowrap ${
              selectedTag
                ? "bg-white text-black border-[#e5e5e5]"
                : "bg-primary border-primary text-white"
            }`}
          >
            {t["All"]}
          </button>
          <div className="flex overflow-x-auto w-full py-1 items-center gap-3">
            {selectedTag ? (
              <div className="flex items-center gap-2 font-bold">
                <TbMathGreater size={12} />
                {selectedTag &&
                  selectCategory &&
                  JSON.parse(selectCategory)[locale]}
                <TbMathGreater size={12} />
                <div className="bg-primary border border-primary rounded-xl text-white pl-1 pr-2 py-[1px] flex items-center gap-2">
                  <span className="bg-[#d9d9d9] rounded-xl text-black px-2 py-0.5 text-[10px]">
                    {selectedTag.total}
                  </span>
                  {selectedTag.tag}
                </div>
              </div>
            ) : (
              <div className=" flex gap-3">
                {groupedTags.map((category: any, index: number) => (
                  <div
                    key={index}
                    className={`font-bold whitespace-nowrap ${
                      selectedCategory &&
                      category.id === selectedCategory[0].value &&
                      "bg-primary text-white rounded-full px-2"
                    }`}
                  >
                    {category.name ? (
                      <button
                        onClick={() =>
                          handleSelectCategory([
                            {
                              value: category.id,
                              label: JSON.parse(category.name)[locale],
                            },
                          ])
                        }
                      >
                        {JSON.parse(category.name)[locale]}
                      </button>
                    ) : (
                      "Uncategorized"
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div aria-label="close sidebar" className="drawer-side z-30">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="bg-white p-6 min-w-[300px]">
          <div className="flex items-center gap-2 mb-2">
            <LuSettings2
              size={18}
              className="border-2 border-black rounded-md p-0.5"
            />
            <div className="font-bold">{t["카테고리"]}</div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => handleSelectTag("", "")}
              className={`rounded-xl font-bold px-4 py-[1px] border hover:underline ${
                selectedTag
                  ? "bg-white text-black border-[#e5e5e5]"
                  : "bg-primary border-primary text-white"
              }`}
            >
              {t["All"]}
            </button>
            {selectedTag && (
              <div className="flex items-center gap-2 font-bold">
                <TbMathGreater size={12} />
                {selectedTag &&
                  selectCategory &&
                  JSON.parse(selectCategory)[locale]}
                <TbMathGreater size={12} />
                <div className="bg-primary border border-primary rounded-xl text-white pl-1 pr-2 py-[1px] flex items-center gap-2">
                  <span className="bg-[#d9d9d9] rounded-xl text-black px-2 py-0.5 text-[10px]">
                    {selectedTag.total}
                  </span>
                  {selectedTag.tag}
                </div>
              </div>
            )}
          </div>

          <div className={`divide-y-[1px] divide-[#e5e5e5]`}>
            {groupedTags.map((category: any, index: number) => (
              <div key={index} className="flex-grow pt-4 first:pl-0">
                <div
                  className={`font-bold mb-4 border-b border-transparent hover:border-black w-fit ${
                    selectedCategory &&
                    category.id === selectedCategory[0].value &&
                    "bg-primary text-white rounded-full px-2"
                  }`}
                >
                  {category.name ? (
                    <button
                      onClick={() =>
                        handleSelectCategory([
                          {
                            value: category.id,
                            label: JSON.parse(category.name)[locale],
                          },
                        ])
                      }
                    >
                      {JSON.parse(category.name)[locale]}
                    </button>
                  ) : (
                    "Uncategorized"
                  )}
                  <span className="ml-3 font-normal">{category.total}</span>
                </div>
                <div className={`space-y-2 pb-4`}>
                  {category.tags.map((tag: any, index: number) => (
                    <button
                      key={index}
                      className={`flex items-center gap-2 hover:underline ${
                        selectedTag?.tag === tag.tag
                          ? "bg-primary rounded-xl text-white pl-1 pr-2 py-0.5 font-bold"
                          : "py-0.5"
                      }`}
                      onClick={() => {
                        selectedTag?.tag === tag.tag
                          ? handleSelectTag("", "")
                          : handleSelectTag(tag, category);
                      }}
                    >
                      <div className="bg-[#d9d9d9] rounded-xl px-2 py-0.5 text-[10px] text-black min-w-[33px]">
                        {tag.total}
                      </div>
                      {tag.tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashtagMobile;
