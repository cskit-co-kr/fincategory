import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { useState, useEffect } from 'react';
import { LuSettings2 } from 'react-icons/lu';
import { TbMathGreater } from 'react-icons/tb';
import { RxPinTop } from 'react-icons/rx';

const Hashtag = ({ tags, selectedTag, setSelectedTag, searchListRef }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [pageYOffset, setPageYOffset] = useState(0);

  const handleScroll = () => {
    setPageYOffset(window.scrollY);
  };

  const [groupedTags, setGroupedTags] = useState<any>([]);

  useEffect(() => {
    const reduceTags = tags.reduce((result: any, currentItem: any) => {
      const existingGroup = result.find((group: any) => group.id === currentItem.id);

      if (existingGroup) {
        existingGroup.tags.push({
          tag: currentItem.tag,
          order_id: currentItem.order_id,
          total: currentItem.total,
        });
        existingGroup.tags.sort((a: any, b: any) => b.total - a.total);
        existingGroup.total = existingGroup.tags.reduce((sum: any, tag: any) => sum + Number(tag.total), 0);
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

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<any>();
  const handleSelectTag = (tag: any, category: any) => {
    setSelectedTag(tag);
    setSelectedCategory(category.name);
    window.scrollTo({
      top: 1110,
      behavior: 'smooth',
    });
    //searchListRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`sticky top-0 z-20 white-box py-5 transition-all transform duration-150  ${
        pageYOffset === 0 ? 'h-[340px]' : `h-[63px] overflow-hidden shadow-2xl ${pageYOffset > 180 && 'rounded-t-none'}`
      }`}
    >
      <div className='flex items-center justify-between border-b border-[#e5e5e5] mb-5 pb-4'>
        <div className='flex items-center gap-3'>
          <LuSettings2 size={18} className='border-2 border-black rounded-md p-0.5' />
          <div className='font-bold'>카테고리</div>|
          <button
            onClick={() => handleSelectTag('', '')}
            className={`rounded-xl font-bold px-4 py-[1px] border hover:underline ${
              selectedTag ? 'bg-white text-black border-[#e5e5e5]' : 'bg-primary border-primary text-white'
            }`}
          >
            전체
          </button>
          {selectedTag && (
            <div className='flex items-center gap-2 font-bold'>
              <TbMathGreater size={12} />
              {selectedTag && JSON.parse(selectedCategory)[locale]}
              <TbMathGreater size={12} />
              <div className='bg-primary border border-primary rounded-xl text-white pl-1 pr-2 py-[1px] flex items-center gap-2'>
                <span className='bg-[#d9d9d9] rounded-xl text-black px-2 py-0.5 text-[10px]'>{selectedTag.total}</span>
                {selectedTag.tag}
              </div>
            </div>
          )}
        </div>
        <button
          className={`flex items-center gap-1 text-[11px] bg-gray-50 rounded-full pl-1 pr-2 py-0.5 hover:underline ${
            pageYOffset === 0 && 'hidden'
          }`}
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }}
        >
          <RxPinTop /> 맨위로
        </button>
      </div>

      <div className={`flex divide-x-[1px] divide-[#e5e5e5]`}>
        {groupedTags.map((category: any, index: number) => (
          <div key={index} className='flex-grow pl-4 first:pl-0'>
            <div className='font-bold mb-4 border-b border-transparent hover:border-black w-fit'>
              {category.name ? JSON.parse(category.name)[locale] : 'Uncategorized'}
              <span className='ml-3 font-normal'>{category.total}</span>
            </div>
            <div className={`space-y-2 ${category.tags.length > 6 && 'grid grid-rows-6 grid-flow-col'}`}>
              {category.tags.map((tag: any, index: number) => (
                <button
                  key={index}
                  className={`flex items-center gap-2 hover:underline ${
                    selectedTag?.tag === tag.tag ? 'bg-primary rounded-xl text-white pl-1 pr-2 py-0.5 font-bold' : 'py-0.5'
                  }`}
                  onClick={() => {
                    selectedTag?.tag === tag.tag ? handleSelectTag('', '') : handleSelectTag(tag, category);
                  }}
                >
                  <div className='bg-[#d9d9d9] rounded-xl px-2 py-0.5 text-[10px] text-black min-w-[33px]'>{tag.total}</div>
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
