FROM node:22 as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM ngnix:alpine

COPY --from=build /app/dist /usr/share/ngnix/html

EXPOSE 80