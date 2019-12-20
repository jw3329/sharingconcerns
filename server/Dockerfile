FROM node

WORKDIR /usr/app/server

ADD package*.json ./

RUN npm install

RUN ls

ADD . .

RUN ls && pwd