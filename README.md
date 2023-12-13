## E-mobility App

E-mobility backend app created with [NestJS](https://nestjs.com/) and [Postgres](https://www.postgresql.org.pl/), [Docker](https://www.docker.com/)ized.

## Prerequisites

- [NodeJS](https://nodejs.org/en), LTS or Current version,
- [Docker](https://www.docker.com/) with [Docker Compose](https://docs.docker.com/compose/),
- [Postgres](https://www.postgresql.org/download/windows/) if you want to manage your database,
- Git,
- have set up an email address that will enable you sending emails through SMTP server

## Cloning The Repository

```bash
$ git clone https://github.com/kamwro/emobility-backend-app
```

## Setting Up Environmental Variables

Before you dive in, you need to set up project environmental variables.

1. Open the project directory
2. Create an **_.env_** file in the root directory
3. Paste below content with your custom envs:

```typescript
# Postgres
POSTGRES_USER=user
POSTGRES_PASSWORD=secret
POSTGRES_NAME=test
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# API
NEST_API_PORT=3000

# Tokens
# Secret - 32 char secret code for JWT token. You can use something like $ openssl rand -hex 32 to generate it
ACCESS_JWT_SECRET = EXAMPLE_EXAMPLE__EXAMPLE_EXAMPLE
ACCESS_TOKEN_EXPIRES_IN_MIN = 5

REFRESH_JWT_SECRET = EXAMPLE_EXAMPLE__EXAMPLE_EXAMPLE
REFRESH_TOKEN_EXPIRES_IN_DAY = 7

# Token for confirmation link
VERIFICATION_JWT_SECRET = EXAMPLE_EXAMPLE__EXAMPLE_EXAMPLE
VERIFICATION_TOKEN_EXPIRES_IN_SEC = 120

# Email
EMAIL_HOST =
EMAIL_PORT =
EMAIL_USER =
EMAIL_PASSWORD =


# Dbeaver - optional
POSTGRES_DBEAVER_PORT=5433


# Throttler - optional
THROTTLE_TTL_SHORT = 1000
THROTTLE_LIMIT_SHORT = 3

THROTTLE_TTL_MEDIUM = 10000
THROTTLE_LIMIT_MEDIUM = 20

THROTTLE_TTL_LONG = 60000
THROTTLE_LIMIT_LONG = 100
```

You should also change the create-db.sql file accordingly if you changed database name.

## Running The App

1. Have your Docker running
2. Go to the root project directory
3. Default stage is production. You can change that in the docker-compose
4. Run the following commands in the terminal:

```bash
$ npm run build
```

```bash
$ docker-compose up --build
```

4. Go to http://localhost:3000/api and use the app

## Documentation

- Swagger docs: http://localhost:{port}/api

## Tests

Unit tests included, testing mainly services.
Run the following command in the nest container:

```bash
$ npm run test
```

## Migrations

```bash
$ npm run migration:run
```

```bash
$ npm run migration:create
```

```bash
$ npm run migration:generate
```

```bash
$ npm run migration:revert
```

## Feedback

More than welcome! Pull a request or leave a comment if you wish.

## License

[MIT](https://github.com/kamwro/emobility-backend-app/blob/main/LICENSE)
