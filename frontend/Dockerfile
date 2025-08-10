# Stage 1: 빌드
FROM node:22-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .
RUN npm run build