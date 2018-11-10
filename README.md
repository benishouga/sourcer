# Sourcer
Sourcer is a game that fights using JavaScript programs.

![pr](https://raw.githubusercontent.com/benishouga/sourcer/master/pr.gif)

[Try it out](https://benishouga.github.io/sourcer/standalone.html) - Standalone version & API Document

[Matching Server](https://sourcer.herokuapp.com/) - Please wait a moment for spin up.

## Private matching server

You can set up a private matching server. You can use it in your community.

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Local

```
git clone https://github.com/benishouga/sourcer.git
cd sourcer
npm install
npm start
```

## env
Name | description | required | default
--- | --- | --- | ---
APP_KEY | This is the key to use when signing up. It is used to limit the user of the application. | false | (none)
TEAM_GAME | Set it to 'true' when used in group work. It can enter the name of the teammate. | false | false
ADMIN_PASSWORD | Password of 'admin' with special authority. 'admin' can select any two users and let them fight. | false | (none)
SESSION_SECRET | Session cookie secret. | false | (none)
MONGODB_URI | MongoDB connection string. | true | (none)
PUBLISH_GAMES | Set it to 'true' to show the game to the guest. | false | false
ENV_MESSAGE_EN | Display messages on some screens. | false | (none)
ENV_MESSAGE_JA | Same as above. (for Japanese) | false | (none)

ENV_MESSAGE is set in the following JSON format.
```json
{
  "topMessage": "This message is displayed on the top page not logged in."
}
```

## Lisence
MIT License
