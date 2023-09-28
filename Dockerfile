FROM node:slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NEXT_PUBLIC_CLIENT_API_URL=https://test-fincat.fincategory.com
ENV NEXT_PUBLIC_AVATAR_URL=https://test-fincat.fincategory.com
ENV NEXT_PUBLIC_API_URL=https://test-api.fincategory.com
ENV NEXT_PUBLIC_BACKEND_URL=https://test-backend.fincategory.com
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID="G-EF5J5GY669"
ENV JWT_SECRET_KEY=9FZID6AKGFVV4J99T3HJ
ENV NEXTAUTH_URL=https://test-fincat.fincategory.com
ENV KAKAO_CLIENT_ID=940492
ENV KAKAO_CLIENT_SECRET=15d7f66e31a6069527a4ed2c970e097c
ENV NEXT_LOCAL_API_URL=ws://localhost:8081
ENV NEXT_PUBLIC_IMAGE_URL=https://test-file.fincategory.com
ENV IS_LOCAL=false


# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

ENTRYPOINT ["yarn", "start"]