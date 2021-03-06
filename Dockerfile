FROM node:lts-alpine as build
ARG BUILD_CONTEXT
ARG API_URL
ENV NEXT_PUBLIC_API_URL=${API_URL}

WORKDIR /base
COPY . .
RUN yarn install

RUN yarn build:${BUILD_CONTEXT}
ENV BUILD_CONTEXT_ENV=${BUILD_CONTEXT}

CMD yarn start:${BUILD_CONTEXT_ENV}
