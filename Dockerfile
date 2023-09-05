FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

ENTRYPOINT ["yarn", "start"]