import React, { useState } from 'react';

const RenderPost = ({ message, entities }: any) => {
  let addedPosition = 0;
  let styledMessage = message;
  entities?.forEach((entity: any, index: number) => {
    const start2 = entities[index - 1]?.offset === entity.offset ? 4 : 0;
    const start = entity.offset + addedPosition - start2;
    const end = entity.offset + entity.length + addedPosition;
    switch (entity._) {
      case 'messageEntityTextUrl':
        const url = entity.url === undefined ? '#' : entity.url;
        styledMessage =
          styledMessage.slice(0, start) +
          `<a href="${url}" class="text-primary underline" target="_blank">${styledMessage.slice(start, end)}</a>` +
          styledMessage.slice(end);
        addedPosition = addedPosition + 62 + url.length;
        break;

      case 'messageEntityUrl':
        const url2 = styledMessage.slice(start, end); //entity.url === undefined ? '#' : entity.url;
        styledMessage =
          styledMessage.slice(0, start) +
          `<a href="${url2}" class="text-primary underline" target="_blank">${styledMessage.slice(start, end)}</a>` +
          styledMessage.slice(end);
        addedPosition = addedPosition + 62 + url2.length;
        break;

      case 'messageEntityMention':
        styledMessage =
          styledMessage.slice(0, start) +
          `<a href="/channel/${styledMessage.slice(start + 1, end)}" class="text-primary underline" target="_blank">${styledMessage.slice(
            start,
            end
          )}</a>` +
          styledMessage.slice(end);
        addedPosition = addedPosition + 70 + styledMessage.slice(start, end).length;
        break;

      case 'messageEntityBold':
        styledMessage = styledMessage.slice(0, start) + '<b>' + styledMessage.slice(start, end) + '</b>' + styledMessage.slice(end);
        addedPosition = addedPosition + 7;
        break;

      case 'messageEntityItalic':
        styledMessage = styledMessage.slice(0, start) + '<i>' + styledMessage.slice(start, end) + '</i>' + styledMessage.slice(end);
        addedPosition = addedPosition + 7;
        break;

      case 'messageEntityUnderline':
        styledMessage = styledMessage.slice(0, start) + '<u>' + styledMessage.slice(start, end) + '</u>' + styledMessage.slice(end);
        addedPosition = addedPosition + 7;
        break;

      case 'messageEntityStrike':
        styledMessage = styledMessage.slice(0, start) + '<s>' + styledMessage.slice(start, end) + '</s>' + styledMessage.slice(end);
        addedPosition = addedPosition + 7;
        break;

      case 'messageEntityHashtag':
        styledMessage =
          styledMessage.slice(0, start) +
          '<span class="bg-gray-100 px-1 py-0.5 mx-1 rounded-full text-xs font-semibold">' +
          styledMessage.slice(start, end) +
          '</span>' +
          styledMessage.slice(end);
        addedPosition = addedPosition + 85;

        break;
      // add other cases for different entity types as needed
    }
  });
  const html = styledMessage?.replace(/\n/g, '<br>');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default RenderPost;
