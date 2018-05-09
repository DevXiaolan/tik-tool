FROM node:9.11.1

ADD package.json /app/

WORKDIR /app

RUN npm install

ADD . /app

CMD ["npm", "start"]