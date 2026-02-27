## E-mobility App

E-mobility backend app created with [NestJS](https://nestjs.com/) and [Postgres](https://www.postgresql.org.pl/), [Docker](https://www.docker.com/)ized.

## Prerequisites

- [Node.js](https://nodejs.org/en), LTS or Current version,
- [Docker](https://www.docker.com/) with [Docker Compose](https://docs.docker.com/compose/),
- [Postgres](https://www.postgresql.org/download/windows/) if you want to manage your database,
- Git,
- have set up an email address that will enable you to send emails through SMTP server

## Cloning The Repository

```bash
$ git clone https://github.com/kamwro/emobility-backend-app
```

## Setting Up Environmental Variables

Run

```bash
$ cp .env.example .env
```

You should also change the create-db.sql file accordingly if you changed the database name.

## Running The App In Production Stage

1. Have your Docker running
2. Go to the root project directory
3. Run the following command in the terminal:

```bash
$ docker-compose up --build
```

Go to http://localhost:3000/api and use the app

## Documentation

Swagger docs: http://localhost:{port}/api

## Unit Tests And E2E Tests

```bash
$ npm run test
```

```bash
$ npm run test:e2e
```

## Migrations

Initial migration includes some entries with charging station types and charging stations data populated.

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
