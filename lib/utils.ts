// import cheerio from "cheerio";
import * as cheerio from "cheerio";

function formatDate(date: string) {
  let newDate = new Date(date);
  const timezoneOffset = 0; //540; //newDate.getTimezoneOffset();

  const localDate: any = new Date(
    newDate.getTime() - timezoneOffset * 60 * 1000
  );

  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1;
  let day = localDate.getDate();
  let hour = localDate.getHours();
  let minute = localDate.getMinutes();

  const currentDate: any = new Date();
  // const timeDifference: any = currentDate - localDate;
  // const oneDay = 24 * 60 * 60 * 1000;
  // const isWithin24Hours = timeDifference < oneDay;
  const isWithin24Hours =
    currentDate.getDate() === day && currentDate.getMonth() + 1 === month
      ? true
      : false;

  const formattedDateTime = isWithin24Hours
    ? hour.toString().padStart(2, "0") +
      ":" +
      minute.toString().padStart(2, "0")
    : `${year}.${`00${month}`.slice(-2)}.${`00${day}`.slice(-2)}`;
  return formattedDateTime;
}

const toDateformat = (date: string, separator = "") => {
  let newDate = new Date(date);
  const timezoneOffset = 0; //540; //newDate.getTimezoneOffset();

  const localDate: any = new Date(
    newDate.getTime() - timezoneOffset * 60 * 1000
  );

  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1;
  let day = localDate.getDate();

  const formattedDateTime = `${year}.${`00${month}`.slice(
    -2
  )}.${`00${day}`.slice(-2)}`;
  return formattedDateTime;
};

const getToday = (separator = "") => {
  let newDate = new Date();
  const timezoneOffset = 0; //540; //newDate.getTimezoneOffset();

  const localDate = new Date(newDate.getTime() - timezoneOffset * 60 * 1000);

  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1;
  let day = localDate.getDate();

  return `${year}${separator}${`00${month}`.slice(
    -2
  )}${separator}${`00${day}`.slice(-2)}`;
};

const toDateTimeformat = (date: string, separator = "") => {
  let newDate = new Date(date);
  const timezoneOffset = 0; //540; //newDate.getTimezoneOffset();

  const localDate = new Date(newDate.getTime() - timezoneOffset * 60 * 1000);

  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1;
  let day = localDate.getDate();
  let hour = localDate.getHours();
  let minute = localDate.getMinutes();

  return `${year}${separator}${`00${month}`.slice(
    -2
  )}${separator}${`00${day}`.slice(-2)} ${`00${hour}`.slice(
    -2
  )}:${`00${minute}`.slice(-2)}`;
};

function getHrefValue(str: string) {
  const $ = cheerio.load(str);
  const anchorElement = $("a").first();

  if (anchorElement) {
    return anchorElement.attr("href");
  }

  return "";
}

const formatKoreanNumber = (value: number): string => {
  // if (value >= 1000 && value < 10000) return (Math.floor((value / 1000) * 10) / 10).toLocaleString() + '천';
  // if (value >= 10000) return (Math.floor((value / 10000) * 10) / 10).toLocaleString() + '만';
  return value.toLocaleString().toString();
};

const getDuration = (start: any, end: any) => {
  const a: any = new Date(start);
  const b: any = new Date(end);

  const differenceInMilliseconds = b - a;

  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  return Math.trunc(differenceInDays);
};

const hashtagReduce = (tags: any) => {
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
  return reduceTags;
};

const getAverages = async (channel_id: any, subscription: any) => {
  let averageViews = 0;
  let averagePosts = 0;
  let averageErr = 0;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ channel_id: channel_id }),
    }
  );
  const combinedReturn = await res.json();
  if (combinedReturn[0].total.length > 0) {
    averageViews = Math.round(
      combinedReturn[0].average.reduce((a: any, b: any) => {
        return a + b.average;
      }, 0) / combinedReturn[0].average.length
    );

    averagePosts = Math.round(
      combinedReturn[0].average.slice(-7).reduce((a: any, b: any) => {
        return a + b.posts;
      }, 0) / combinedReturn[0].average.slice(-7).length
    );

    const errPercent = combinedReturn[0].average.map((item: any) => ({
      date: item.date,
      views: Math.round((item.average * 100) / subscription),
    }));

    averageErr =
      errPercent.reduce((a: any, b: any) => {
        return a + b.views;
      }, 0) / errPercent.length;

    return {
      averageViews: averageViews,
      averagePosts: averagePosts,
      averageErr: averageErr,
    };
  }
};

export {
  formatDate,
  toDateTimeformat,
  toDateformat,
  getHrefValue,
  formatKoreanNumber,
  getToday,
  getDuration,
  hashtagReduce,
  getAverages,
};
