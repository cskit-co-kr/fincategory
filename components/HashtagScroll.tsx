const HashtagScroll = ({ tags, selectedTag, setSelectedTag }: any) => {
  return (
    <div className='flex scrollable-container select-none'>
      {tags?.map((tag: any, index: any) => (
        <div key={index} className='mr-1'>
          <button
            className={`group flex gap-1 px-2 md:px-3 py-2 md:py-2 whitespace-nowrap border border-gray-200 rounded-3xl md:hover:bg-primary md:hover:text-white ${
              selectedTag === tag.tag ? 'bg-primary text-white font-bold' : 'text-black bg-white'
            }`}
            onClick={() => {
              selectedTag === tag.tag ? setSelectedTag('') : setSelectedTag(tag.tag);
            }}
          >
            {tag.tag}
            <span
              className={`text-[10px] md:text-xs block bg-gray-200 rounded-full px-1.5 py-0.5 md:group-hover:text-black ${
                selectedTag === tag.tag ? 'text-black' : ''
              }`}
            >
              {tag.total}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default HashtagScroll;
