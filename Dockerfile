FROM node:18-alpine

WORKDIR /emobility-backend-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]