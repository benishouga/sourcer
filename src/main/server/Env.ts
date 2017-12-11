export default class Env {
  public static appKey = process.env.APP_KEY as string;
  public static isTeamGame = (!!process.env.TEAM_GAME &&
    (process.env.TEAM_GAME as string).toUpperCase() === 'TRUE') as boolean;
  public static adminPassword = process.env.ADMIN_PASSWORD as string;
  public static mongodbUri = process.env.MONGODB_URI as string;
  public static mongoTest = process.env.MONGO_TEST as string;
  public static sessionSecret = process.env.SESSION_SECRET as string;
  public static port = process.env.PORT as string;
  public static isPublishGames = (!!process.env.PUBLISH_GAMES &&
    (process.env.PUBLISH_GAMES as string).toUpperCase() === 'TRUE') as boolean;
  public static envMessages = {
    en: (process.env.ENV_MESSAGE_EN ? JSON.parse(process.env.ENV_MESSAGE_EN as string) : {}) as EnvMessage,
    ja: (process.env.ENV_MESSAGE_JA ? JSON.parse(process.env.ENV_MESSAGE_JA as string) : {}) as EnvMessage
  };
}
