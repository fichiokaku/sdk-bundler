FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm run build

COPY . .
EXPOSE 5555

CMD [ "npm", "start" ]