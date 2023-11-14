FROM node:lts-bookworm-slim

WORKDIR /emobility-backend-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]