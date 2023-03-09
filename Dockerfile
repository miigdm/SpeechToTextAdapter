FROM node:16-alpine

WORKDIR /app
ADD . /app

RUN npm install
RUN npm start

EXPOSE 8021
CMD [ "node", "app.js" ]