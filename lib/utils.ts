const formatDate = (dateString: string) => {
  const date: any = new Date(dateString);
  const currentDate: any = new Date();
  const timeDifference: any = currentDate - date;
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const isWithin24Hours = timeDifference < oneDay;
  const formattedDateTime = isWithin24Hours
    ? date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
    : date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
  return formattedDateTime;
}

const toDateTimeformat = (date: string, separator = '') => {
  let newDate = new Date(date);
  const timezoneOffset = newDate.getTimezoneOffset();
  const localDate = new Date(newDate.getTime() - (timezoneOffset * 60 * 1000));

  let year = localDate.getFullYear()
  let month = localDate.getMonth() + 1
  let day = localDate.getDate();
  let hour = localDate.getHours();
  let minute = localDate.getMinutes();
  let second = localDate.getSeconds();

  return `${year}${separator}${(`00${month}`).slice(-2)}${separator}${(`00${day}`).slice(-2)} ${(`00${hour}`).slice(-2)}:${(`00${minute}`).slice(-2)}`
}

export { formatDate, toDateTimeformat }