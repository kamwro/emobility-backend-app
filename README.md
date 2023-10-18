## E-mobility App

E-mobility backend app created with [NestJS](https://nestjs.com/) and [Postgres](https://www.postgresql.org.pl/).

## Prerequisites

- [NodeJS](https://nodejs.org/en), LTS or Current version,
- [Docker](https://www.docker.com/) with [Docker Compose](https://docs.docker.com/compose/),
- have set up an email address that will enable you sending emails through SMTP server

## Cloning The Repository

```bash
$ git clone https://github.com/kamwro/emobility-backend-app
```

## Setting Up Environmental Variables

Before you dive in, you need to set up project environmental variables.
1. Open the project directory
2. Create an ***.env*** file in the root directory
3. Paste below content with your custom envs:

```typescript
# Postgres
POSTGRES_USER=user
POSTGRES_PASSWORD=secret
POSTGRES_DB_PREFIX=db
POSTGRES_DB_NAME=nestjs
POSTGRES_DB_HOST=postgres
POSTGRES_DB_PORT=5432
```

## Running The App

1. Have your Docker running
2. Go to the root project directory
3. Run the following command in the terminal and wait:
```bash
$ docker-compose up --build
```
4. Go to http://localhost:3000/api and use the app

## Documentation

- [Swagger docs](http://localhost:3000/api)

## Testing The App

**WORK IN PROGRESS**

## Design Patterns And Clean Code

**WORK IN PROGRESS**

## Feedback

More than welcome! Pull a request or leave a comment if you wish.

## Future Plans

**WORK IN PROGRESS**

## License

[MIT](https://github.com/kamwro/emobility-backend-app/blob/main/LICENSE)
