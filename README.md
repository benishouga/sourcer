# Sourcer
Battle game using programs.



[What's Sourcer ?](https://benishouga.github.io/sourcer/)

[Try it.](https://sourcer.herokuapp.com/)

You can set up a private server.

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Manual

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
