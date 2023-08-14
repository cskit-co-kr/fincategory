import cheerio from 'cheerio';

function formatDate(date: string) {
  let newDate = new Date(date);
  const timezoneOffset = newDate.getTimezoneOffset();

  const localDate: any = new Date(newDate.getTime() - timezoneOffset * 60 * 1000);

  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1;
  let day = localDate.getDate();
  let hour = localDate.getHours();
  let minute = localDate.getMinutes();

  const currentDate: any = new Date();
  // const timeDifference: any = currentDate - localDate;
  // const oneDay = 24 * 60 * 60 * 1000;
  // const isWithin24Hours = timeDifference < oneDay;
  const isWithin24Hours = currentDate.getDate() === day ? true : false;

  const formattedDateTime = isWithin24Hours
    ? hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0')
    : `${year}.${`00${month}`.slice(-2)}.${`00${day}`.slice(-2)}`;
  return formattedDateTime;
}

const toDateformat = (date: string, separator = '') => {
  let newDate = new Date(date);
  const timezoneOffset = newDate.getTimezoneOffset();

  const localDate = new Date(newDate.getTime() - timezoneOffset * 60 * 1000);

  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1;
  let day = localDate.getDate();

  return `${year}${separator}${`00${month}`.slice(-2)}${separator}${`00${day}`.slice(-2)}`;
}

const toDateTimeformat = (date: string, separator = '') => {
  let newDate = new Date(date);
  const timezoneOffset = newDate.getTimezoneOffset();

  const localDate = new Date(newDate.getTime() - timezoneOffset * 60 * 1000);

  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1;
  let day = localDate.getDate();
  let hour = localDate.getHours();
  let minute = localDate.getMinutes();

  return `${year}${separator}${`00${month}`.slice(-2)}${separator}${`00${day}`.slice(-2)} ${`00${hour}`.slice(-2)}:${`00${minute}`.slice(-2)}`;
}

function getHrefValue(str: string) {
  const $ = cheerio.load(str);
  const anchorElement = $('a').first();

  if (anchorElement) {
    return anchorElement.attr('href');
  }

  return '';
}

const formatKoreanNumber = (value: number): string => {
  // if (value >= 1000 && value < 10000) return (Math.floor((value / 1000) * 10) / 10).toLocaleString() + '천';
  // if (value >= 10000) return (Math.floor((value / 10000) * 10) / 10).toLocaleString() + '만';
  return value.toLocaleString().toString();
};

export { formatDate, toDateTimeformat, toDateformat, getHrefValue, formatKoreanNumber };
