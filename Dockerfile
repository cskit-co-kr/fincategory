FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock

RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates

RUN yarn

COPY . .

RUN yarn build:prod

EXPOSE 3000

ENTRYPOINT ["yarn", "start"]