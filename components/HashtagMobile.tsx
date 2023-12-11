import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { useState, useEffect } from 'react';
import { LuSettings2 } from 'react-icons/lu';
import { TbMenu2, TbMathGreater } from 'react-icons/tb';
import { RxPinTop } from 'react-icons/rx';
import { hashtagReduce } from '../lib/utils';

const HashtagMobile = ({ tags, selectedTag, setSelectedTag, searchListRef }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [pageYOffset, setPageYOffset] = useState(0);

  const handleScroll = () => {
    setPageYOffset(window.scrollY);
  };

  const [groupedTags, setGroupedTags] = useState<any>([]);

  useEffect(() => {
    const reduceTags = hashtagReduce(tags);

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
      top: 2250,
      behavior: 'smooth',
    });
    //searchListRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`drawer sticky top-0 z-20 bg-gray-50 ${pageYOffset > 10 && 'shadow-xl'}`}>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />

      <div className='drawer-content'>
        {/* Page content here */}
        <div className='flex items-center border-b border-[#e5e5e5] mt-4 px-4 pb-4'>
          <label htmlFor='my-drawer' className='mr-4'>
            <TbMenu2 size={24} />
          </label>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => handleSelectTag('', '')}
              className={`rounded-xl font-bold px-4 py-[1px] border hover:underline ${
                selectedTag ? 'bg-white text-black border-[#e5e5e5]' : 'bg-primary border-primary text-white'
              }`}
            >
              전체
            </button>
            {selectedTag ? (
              <div className='flex items-center gap-2 font-bold'>
                <TbMathGreater size={12} />
                {selectedTag && JSON.parse(selectedCategory)[locale]}
                <TbMathGreater size={12} />
                <div className='bg-primary border border-primary rounded-xl text-white pl-1 pr-2 py-[1px] flex items-center gap-2'>
                  <span className='bg-[#d9d9d9] rounded-xl text-black px-2 py-0.5 text-[10px]'>{selectedTag.total}</span>
                  {selectedTag.tag}
                </div>
              </div>
            ) : (
              groupedTags.map((category: any, index: number) => (
                <div key={index} className='font-bold'>
                  {category.name && JSON.parse(category.name)[locale]}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className='drawer-side z-30'>
        <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>

        <div className='bg-white p-6 min-w-[300px]'>
          <div className='flex items-center gap-2 mb-2'>
            <LuSettings2 size={18} className='border-2 border-black rounded-md p-0.5' />
            <div className='font-bold'>카테고리</div>
          </div>
          <div className='flex items-center gap-2 mb-2'>
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

          <div className={`divide-y-[1px] divide-[#e5e5e5]`}>
            {groupedTags.map((category: any, index: number) => (
              <div key={index} className='flex-grow pt-4 first:pl-0'>
                <div className='font-bold mb-4 border-b border-transparent hover:border-black w-fit'>
                  {category.name ? JSON.parse(category.name)[locale] : 'Uncategorized'}
                  <span className='ml-3 font-normal'>{category.total}</span>
                </div>
                <div className={`space-y-2 pb-4`}>
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
      </div>
    </div>
  );
};

export default HashtagMobile;