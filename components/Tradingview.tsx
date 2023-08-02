import { TickerTape } from 'react-ts-tradingview-widgets';

const Tradingview = () => {
  return (
    <div className='h-[46px] overflow-hidden mb-7'>
      <TickerTape colorTheme='light'></TickerTape>
    </div>
  );
};

export default Tradingview;
