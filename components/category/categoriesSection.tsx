import { useRouter } from "next/router";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useState, useEffect } from "react";
import { LuSettings2 } from "react-icons/lu";
import { TbMathGreater } from "react-icons/tb";
import { RxPinTop } from "react-icons/rx";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
const example = [
  {
    category_id: "1f15be3b-a086-4b11-b083-38c578dd693f",
    category_name:
      '{"en":"Cryptocurrency ","zh":"","ja":"","kk":"","hi":"","de":"","ko":"코인","mn":"Криптовалют","ru":""}',
    image_path:
      "/uploads/images/2024/11/27/14d96bcb-4533-49ac-a565-bd8d7ea0e475.png",
    created_at: "2022-12-21T19:06:38.000Z",
    updated_at: "2024-11-26T18:02:16.000Z",
    deleted_at: null,
    channel_count: "1058",
  },
  {
    category_id: "a6c72477-d03c-4bed-9873-a4adbc078b55",
    category_name:
      '{"en":"Etc","zh":"","ja":"","kk":"","hi":"","de":"","ko":"기타","mn":"","ru":""}',
    image_path:
      "/uploads/images/2024/11/27/907f6847-a206-4d01-8975-00d5cd3da97b.png",
    created_at: "2023-04-26T16:32:35.000Z",
    updated_at: "2024-11-26T18:05:28.000Z",
    deleted_at: null,
    channel_count: "215",
  },
  {
    category_id: "790d1822-0ddb-45a8-b54b-916de69f6cec",
    category_name:
      '{"en":"Finance","zh":"","ja":"","kk":"","hi":"","de":"","ko":"금융","mn":"","ru":""}',
    image_path:
      "/uploads/images/2024/11/27/37ba5fb3-ede9-4b5c-8eba-4ff04b584e77.png",
    created_at: "2022-12-21T19:07:37.000Z",
    updated_at: "2024-11-26T18:02:22.000Z",
    deleted_at: null,
    channel_count: "534",
  },
  {
    category_id: "4502a550-b224-42bb-a694-dbe67f8128c2",
    category_name:
      '{"en":"Information","zh":"","ja":"","kk":"","hi":"","de":"","ko":"정보취미","mn":"","ru":""}',
    image_path: null,
    created_at: "2023-01-10T21:53:24.000Z",
    updated_at: "2024-11-26T17:58:38.000Z",
    deleted_at: null,
    channel_count: "229",
  },
  {
    category_id: "d06a2e12-439f-4c52-a85d-8a0fccca7700",
    category_name:
      '{"en":"Society","zh":"","ja":"","kk":"","hi":"","de":"","ko":"정치사회","mn":"","ru":""}',
    image_path: null,
    created_at: "2023-01-10T22:03:44.000Z",
    updated_at: "2024-11-26T18:18:05.000Z",
    deleted_at: null,
    channel_count: "43",
  },
  {
    category_id: "a6c72477-d03c-4bed-9873-a4adbc078b55",
    category_name:
      '{"en":"Etc","zh":"","ja":"","kk":"","hi":"","de":"","ko":"기타","mn":"","ru":""}',
    image_path:
      "/uploads/images/2024/11/27/907f6847-a206-4d01-8975-00d5cd3da97b.png",
    created_at: "2023-04-26T16:32:35.000Z",
    updated_at: "2024-11-26T18:05:28.000Z",
    deleted_at: null,
    channel_count: "215",
  },
  {
    category_id: "790d1822-0ddb-45a8-b54b-916de69f6cec",
    category_name:
      '{"en":"Finance","zh":"","ja":"","kk":"","hi":"","de":"","ko":"금융","mn":"","ru":""}',
    image_path:
      "/uploads/images/2024/11/27/37ba5fb3-ede9-4b5c-8eba-4ff04b584e77.png",
    created_at: "2022-12-21T19:07:37.000Z",
    updated_at: "2024-11-26T18:02:22.000Z",
    deleted_at: null,
    channel_count: "534",
  },
  {
    category_id: "4502a550-b224-42bb-a694-dbe67f8128c2",
    category_name:
      '{"en":"Information","zh":"","ja":"","kk":"","hi":"","de":"","ko":"정보취미","mn":"","ru":""}',
    image_path: null,
    created_at: "2023-01-10T21:53:24.000Z",
    updated_at: "2024-11-26T17:58:38.000Z",
    deleted_at: null,
    channel_count: "229",
  },
  {
    category_id: "d06a2e12-439f-4c52-a85d-8a0fccca7700",
    category_name:
      '{"en":"Society","zh":"","ja":"","kk":"","hi":"","de":"","ko":"정치사회","mn":"","ru":""}',
    image_path: null,
    created_at: "2023-01-10T22:03:44.000Z",
    updated_at: "2024-11-26T18:18:05.000Z",
    deleted_at: null,
    channel_count: "43",
  },
  {
    category_id: "a6c72477-d03c-4bed-9873-a4adbc078b55",
    category_name:
      '{"en":"Etc","zh":"","ja":"","kk":"","hi":"","de":"","ko":"기타","mn":"","ru":""}',
    image_path:
      "/uploads/images/2024/11/27/907f6847-a206-4d01-8975-00d5cd3da97b.png",
    created_at: "2023-04-26T16:32:35.000Z",
    updated_at: "2024-11-26T18:05:28.000Z",
    deleted_at: null,
    channel_count: "215",
  },
  {
    category_id: "790d1822-0ddb-45a8-b54b-916de69f6cec",
    category_name:
      '{"en":"Finance","zh":"","ja":"","kk":"","hi":"","de":"","ko":"금융","mn":"","ru":""}',
    image_path:
      "/uploads/images/2024/11/27/37ba5fb3-ede9-4b5c-8eba-4ff04b584e77.png",
    created_at: "2022-12-21T19:07:37.000Z",
    updated_at: "2024-11-26T18:02:22.000Z",
    deleted_at: null,
    channel_count: "534",
  },
  {
    category_id: "4502a550-b224-42bb-a694-dbe67f8128c2",
    category_name:
      '{"en":"Information","zh":"","ja":"","kk":"","hi":"","de":"","ko":"정보취미","mn":"","ru":""}',
    image_path: null,
    created_at: "2023-01-10T21:53:24.000Z",
    updated_at: "2024-11-26T17:58:38.000Z",
    deleted_at: null,
    channel_count: "229",
  },
  {
    category_id: "d06a2e12-439f-4c52-a85d-8a0fccca7700",
    category_name:
      '{"en":"Society","zh":"","ja":"","kk":"","hi":"","de":"","ko":"정치사회","mn":"","ru":""}',
    image_path: null,
    created_at: "2023-01-10T22:03:44.000Z",
    updated_at: "2024-11-26T18:18:05.000Z",
    deleted_at: null,
    channel_count: "43",
  },
];

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

  const handleSubmit = () => {
    // if (searchField !== "") {
    //   if (searchSection === 1) {
    //     router.push({
    //       pathname: "/",
    //       query: { q: searchField },
    //       hash: "",
    //     });
    //   } else if (searchSection === 2) {
    //     router.push(`/board?q=${searchField}`);
    //   }
    // }
  };

  return (
    <div
      className={`sticky top-0 z-20 .hidden .lg:block white-box pb-[20px] transition-all transform duration-150 overflow-hidden  ${
        pageYOffset === false
          ? "h-[464px]"
          : `h-[76px] overflow-hidden shadow-2xl ${
              pageYOffset === "true" && "rounded-t-none"
            }`
      }`}
    >
      <div className="flex items-center justify-between gap-[10px] border-b border-[#e5e5e5] pt-[20px] pb-[19px] px-[10px] mb-[20px]">
        <div className="flex items-center gap-3">
          <LuSettings2
            size={18}
            className="border-2 border-black rounded-md p-0.5"
          />
          <div className="font-bold">{t["카테고리"]}</div>|
          <button
            onClick={() => handleSelectTag("", "")}
            className={`rounded-xl font-bold px-4 py-[1px] border hover:underline ${
              selectedTag || selectedCategory
                ? "bg-white text-black border-[#e5e5e5]"
                : "bg-primary border-primary text-white"
            }`}
          >
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
        <div className="flex flex-row gap-[10px]">
          <div className="relative border border-primary items-center py-[7px] px-[11px] rounded-full hidden md:inline-flex hover:shadow-md">
            <input
              type="text"
              name="search"
              // value={searchField}
              // onChange={(e) => setSearchField(e.target.value)}
              // onKeyDown={handleKeyDown}
              className="outline-none pl-3 w-24 md:w-80 xl:w-96 text-sm"
              aria-label="Search"
              placeholder="Search..."
            />
            {/* <button
              className="text-xs py-1 px-2 flex gap-1 items-center rounded-full min-w-[70px] justify-center text-dark-primary"
              onClick={() => setSearchSectionMenu((prev) => !prev)}
            >
              {searchSection === 1 ? t["channel/group"] : t["board"]}
              <FaCaretDown size={14} />
            </button>
            {searchSectionMenu && (
              <div
                className="absolute top-9 right-10 border shadow-md bg-white flex flex-col rounded-xl min-w-[50px] text-xs"
                ref={searchRef}
              >
                <button
                  onClick={() => {
                    setSearchSection(1);
                    setSearchSectionMenu((prev) => !prev);
                  }}
                  className="px-3 py-2 hover:bg-gray-50 rounded-xl"
                >
                  {t["channel/group"]}
                </button>
                <button
                  onClick={() => {
                    setSearchSection(2);
                    setSearchSectionMenu((prev) => !prev);
                  }}
                  className="px-3 py-2 hover:bg-gray-50 rounded-xl"
                >
                  {t["board"]}
                </button>
              </div>
            )} */}
            <button className="h-fit" onClick={handleSubmit} name="search">
              <MagnifyingGlassIcon className="h-5 text-primary mr-1" />
            </button>
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
        </div>
      </div>
      {/* <div className="flex flex-col"> */}
      <div className="lg:grid grid-rows-8 grid-cols-5 gap-y-[4px] gap-x-[4px] grid-flow-col hidden">
        {categories.map((category: any, index: number) => (
          // {example.map((category: any, index: number) => (
          <div className="flex flex-row gap-[8px] p-[10px] max-h-[40px]">
            <Image
              className="max-h-[20px] max-w-[20px]"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/getImage?image_path=${category?.image_path}`}
              alt="image_path"
              height={20}
              width={20}
            />
            <span> {JSON.parse(category.category_name)[locale]}</span>
            <span>({category?.channel_count})</span>
          </div>
        ))}
      </div>
      {/* </div> */}
      {/* <div className={`flex divide-x-[1px] divide-[#e5e5e5]`}>
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
      </div> */}
    </div>
  );
};

export default CategoriesSection;
