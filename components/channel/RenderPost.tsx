import React from 'react';

const RenderPost = ({ message, entities }: any) => {
  let styledMessage = message;
  entities?.reverse().forEach((entity: any) => {
    const start = entity.offset;
    const end = entity.offset + entity.length;
    switch (entity._) {
      case 'messageEntityTextUrl':
        const url = entity.url === undefined ? '#' : entity.url;
        styledMessage =
          styledMessage.slice(0, start) +
          `<a href="${url}" class="text-primary underline" target="_blank">${styledMessage.slice(
            start,
            end
          )}</a>` +
          styledMessage.slice(end);
        break;
      case 'messageEntityUrl':
        const url2 = entity.url === undefined ? '#' : entity.url;
        styledMessage =
          styledMessage.slice(0, start) +
          `<a href="${url2}" class="text-primary underline" target="_blank">${styledMessage.slice(
            start,
            end
          )}</a>` +
          styledMessage.slice(end);
        break;
      case 'messageEntityBold':
        styledMessage =
          styledMessage.slice(0, start) +
          '<b>' +
          styledMessage.slice(start, end) +
          '</b>' +
          styledMessage.slice(end);
        break;
      case 'messageEntityItalic':
        styledMessage =
          styledMessage.slice(0, start) +
          '<i>' +
          styledMessage.slice(start, end) +
          '</i>' +
          styledMessage.slice(end);
        break;

      case 'messageEntityUnderline':
        styledMessage =
          styledMessage.slice(0, start) +
          '<u>' +
          styledMessage.slice(start, end) +
          '</u>' +
          styledMessage.slice(end);
        break;
      case 'messageEntityStrike':
        styledMessage =
          styledMessage.slice(0, start) +
          '<s>' +
          styledMessage.slice(start, end) +
          '</s>' +
          styledMessage.slice(end);
        break;
      // add other cases for different entity types as needed
    }
  });
  const html = styledMessage.replace(/\n/g, '<br>');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default RenderPost;
