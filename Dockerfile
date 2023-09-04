FROM node:18-alpine

ENV NEXT_PUBLIC_CLIENT_API_URL=https://finca.co.kr
ENV NEXT_PUBLIC_AVATAR_URL=https://fincategory.com
ENV NEXT_PUBLIC_API_URL=https://api.fincategory.com
ENV NEXT_PUBLIC_BACKEND_URL=https://backend.fincategory.com
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID="G-EF5J5GY669"
ENV JWT_SECRET_KEY=9FZID6AKGFVV4J99T3HJ
ENV NEXTAUTH_URL=https://finca.co.kr
ENV KAKAO_CLIENT_ID=940492
ENV KAKAO_CLIENT_SECRET=15d7f66e31a6069527a4ed2c970e097c
ENV NEXT_LOCAL_API_URL=ws://localhost:8081
ENV NEXT_PUBLIC_IMAGE_URL=https://file.fincategory.com

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