FROM node:20-bookworm-slim as base

WORKDIR /.

COPY package*.json ./

FROM base as development

RUN npm install

COPY . . 

RUN npm run build

CMD [ "npm", "run", "start:dev" ]

FROM base as production

RUN npm install --omit=dev

COPY --from=development /dist /.

CMD [ "npm", "run", "start:prod" ]

FROM base as test

RUN npm ci

COPY . . 

RUN npm run build

CMD [ "npm", "run", "test" ]