FROM node:20-bookworm-slim as build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /src

COPY package*.json /.

RUN npm install

COPY . .  

RUN npm run build 

FROM node:20-bookworm-slim as production

WORKDIR /src

ENV NODE_ENV production

COPY package*.json /.

RUN npm ci --omit=dev

COPY --from=build /bin/dumb-init /bin/dumb-init

USER node

COPY --chown=node:node . .

COPY --chown=node:node --from=build ./src/dist ./dist

CMD ["dumb-init", "node", "dist/src/main" ]