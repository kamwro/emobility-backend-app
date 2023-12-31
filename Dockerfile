FROM node:20-bookworm-slim as base-image

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /src

COPY package*.json /.

# production

FROM base-image as build-prod

WORKDIR /src

RUN npm ci --omit=dev

FROM build-prod as production

ENV NODE_ENV production

COPY --from=build-prod /bin/dumb-init /bin/dumb-init

USER node

WORKDIR /src

COPY --chown=node:node --from=build-prod node_modules node_modules

COPY --chown=node:node . .

CMD ["dumb-init", "npm", "run", "start:prod" ]

# development

FROM base-image as build-dev

WORKDIR /src

RUN npm install

FROM build-dev as development

ENV NODE_ENV development

COPY --from=build-dev /bin/dumb-init /bin/dumb-init

USER node

WORKDIR /src

COPY --chown=node:node --from=build-dev node_modules node_modules

COPY --chown=node:node . .

CMD [ "dumb-init", "npm", "run", "start:dev" ]