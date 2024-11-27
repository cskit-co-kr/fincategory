import { useRouter } from "next/router";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import { useState, useEffect } from "react";
import { LuSettings2 } from "react-icons/lu";
import { TbMathGreater } from "react-icons/tb";
import { RxPinTop } from "react-icons/rx";

const Hashtag = ({
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

  const [pageYOffset, setPageYOffset] = useState<any>(false);

  const handleScroll = () => {
    if (window.scrollY > 180) {
      pageYOffset !== "true" ? setPageYOffset("true") : null;
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
  const [groupedTags, setGroupedTags] = useState<any>([]);
  // console.log("tags", tags);
  // console.log("groupedTags", groupedTags);
  useEffect(() => {
    const reduceTags = tags.reduce((result: any, currentItem: any) => {
      const existingGroup = result.find(
        (group: any) => group.id === currentItem.id
      );

      if (existingGroup) {
        existingGroup.tags.push({
          tag: currentItem.tag,
          order_id: currentItem.order_id,
          total: currentItem.total,
        });
        existingGroup.tags.sort((a: any, b: any) => b.total - a.total);
        existingGroup.total = existingGroup.tags.reduce(
          (sum: any, tag: any) => sum + Number(tag.total),
          0
        );
      } else {
        result.push({
          name: currentItem.name,
          id: currentItem.id,
          total: Number(currentItem.total),
          tags: [
            {
              tag: currentItem.tag,
              order_id: currentItem.order_id,
              total: currentItem.total,
            },
          ],
        });
      }
      result.sort((a: any, b: any) => b.total - a.total);
      return result;
    }, []);

    setGroupedTags(reduceTags);
  }, []);

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

  return (
    <div
      className={`sticky top-0 z-20 hidden lg:block white-box py-5 transition-all transform duration-150 overflow-hidden  ${
        pageYOffset === false
          ? "h-[340px]"
          : `h-[63px] overflow-hidden shadow-2xl ${
              pageYOffset === "true" && "rounded-t-none"
            }`
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#e5e5e5] mb-5 pb-4">
        <div className="flex items-center gap-3">
          <LuSettings2
            size={18}
            className="border-2 border-black rounded-md p-0.5"
          />
          <div className="font-bold">카테고리</div>|
          <button
            onClick={() => handleSelectTag("", "")}
            className={`rounded-xl font-bold px-4 py-[1px] border hover:underline ${
              selectedTag || selectedCategory
                ? "bg-white text-black border-[#e5e5e5]"
                : "bg-primary border-primary text-white"
            }`}
          >
            전체
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

      <div className={`flex divide-x-[1px] divide-[#e5e5e5]`}>
        {groupedTags.map((category: any, index: number) => (
          <div key={index} className="flex-grow pl-4 first:pl-0">
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
                        total: category.total,
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
            <div
              className={`${
                category.tags.length > 6 && "grid grid-rows-6 grid-flow-col"
              }`}
            >
              {category.tags.map((tag: any, index: number) => (
                <button
                  key={index}
                  className={`flex items-center gap-2 hover:underline mb-2 ${
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
  );
};

export default Hashtag;
