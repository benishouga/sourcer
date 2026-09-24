# Sourcer

Sourcer is a game that fights using JavaScript programs.

![pr](https://raw.githubusercontent.com/benishouga/sourcer/master/pr.gif)

[Try it out](https://benishouga.github.io/sourcer/standalone.html) - Standalone version & API Document

[Matching Server](https://sourcer.herokuapp.com/) - Please wait a moment for spin up.

## Private matching server

You can set up a private matching server. You can use it in your community.

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Local development

#### Requirements

- [Node.js](https://nodejs.org/) 18+ (project targets the Active LTS line)
- [pnpm](https://pnpm.io/) 8.15.4 (matches the packageManager field)

#### Initial setup

```
git clone https://github.com/benishouga/sourcer.git
cd sourcer
pnpm install
cp .env.example .env   # or copy .env.example .env on Windows
# edit .env to set MONGODB_URI and other secrets
```

The repo is a pnpm workspace organized as:

- apps/api ? Express + MongoDB backend and REST APIs
- apps/web ? Vite + React single-page client
- packages/core ? shared gameplay logic, DTOs, and workers used by both apps

#### Everyday commands

| Task                                       | Command                                                        |
| ------------------------------------------ | -------------------------------------------------------------- |
| Run backend in watch mode                  | pnpm --filter @sourcer/api dev                                 |
| Run the Vite client with hot reload        | pnpm --filter @sourcer/web dev                                 |
| Build everything for production            | pnpm run build                                                 |
| Start the compiled API + serve docs bundle |
| pm start (delegates to pnpm scripts)       |
| Run tests                                  | pnpm run test (or scope, e.g. pnpm --filter @sourcer/api test) |

Because the build graph is dependency-aware, you can scope commands to a single package while iterating (for example, pnpm --filter @sourcer/web run build).

## env

| Name             | description                                                                                      | required | default |
| ---------------- | ------------------------------------------------------------------------------------------------ | -------- | ------- |
| APP_KEY          | This is the key to use when signing up. It is used to limit the user of the application.         | false    | (none)  |
| TEAM_GAME        | Set it to 'true' when used in group work. It can enter the name of the teammate.                 | false    | false   |
| ADMIN_PASSWORD   | Password of 'admin' with special authority. 'admin' can select any two users and let them fight. | false    | (none)  |
| SESSION_SECRET   | Session cookie secret.                                                                           | false    | (none)  |
| MONGODB_URI      | MongoDB connection string.                                                                       | true     | (none)  |
| MONGO_TEST       | MongoDB connection string for automated tests.                                                   | false    | (none)  |
| PUBLISH_GAMES    | Set it to 'true' to show the game to the guest.                                                  | false    | false   |
| DISPLAY_LANGUAGE | Specify the display language. (support for 'auto', 'en', 'ja')                                   | false    | auto    |
| ENV_MESSAGE_EN   | Display messages on some screens.                                                                | false    | (none)  |
| ENV_MESSAGE_JA   | Same as above. (for Japanese)                                                                    | false    | (none)  |

ENV_MESSAGE is set in the following JSON format.

```json
{
  "topMessage": "This message is displayed on the top page not logged in."
}
```

Copy `.env.example` to `.env` and adjust the values for your environment. The app loads this file automatically on startup, so you no longer need to export `MONGODB_URI` manually for local development.

### Local MongoDB helper

`docker-compose.yml` is intentionally minimal and only starts a standalone MongoDB instance for local development. Run `docker-compose up -d mongo` if you need a quick database for testing, and update `MONGODB_URI` in `.env` to point at the container (`mongodb://127.0.0.1:27017/sourcer` by default).

## Lisence

MIT License
