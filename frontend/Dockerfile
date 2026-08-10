# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_API_URL=/api
ARG VITE_AWS_S3_ENDPOINT=/storage
ARG VITE_AWS_S3_BUCKET_NAME=cookbook

ENV VITE_API_URL=$VITE_API_URL \
    VITE_AWS_S3_ENDPOINT=$VITE_AWS_S3_ENDPOINT \
    VITE_AWS_S3_BUCKET_NAME=$VITE_AWS_S3_BUCKET_NAME \
    VITE_BUILD_PATH=dist

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
