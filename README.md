# Sourcer
Match game that fights using JavaScript programs.

![pr](https://raw.githubusercontent.com/benishouga/sourcer/master/pr.gif)

[Try it.](https://benishouga.github.io/sourcer/standalone.html)

[Matching Server](https://sourcer.herokuapp.com/)

## Private matching server

You can set up a private matching server. You can use it in your community.

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Local

```
git clone https://github.com/benishouga/sourcer.git
cd sourcer
npm install
node out/main/server/index.js
```

## env
Name | description | required | default
--- | --- | --- | ---
APP_KEY | This is the key to use when signing up. It is used to limit the user of the application. | false |
TEAM_GAME | Set it to 'true' when used in group work. It can enter the name of the teammate. | true | false
ADMIN_PASSWORD | Password of 'admin' with special authority. | true |
SESSION_SECRET | Session cookie secret. | false |
MONGODB_URI | MongoDB connection string. | true |

## Lisence
MIT License
