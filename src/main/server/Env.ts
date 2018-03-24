export default class Env {
  private static _instance: Env = new Env();
  public static get instance(): Env {
    return this._instance;
  }
  public static reset() {
    this._instance = new Env();
  }

  public appKey = process.env.APP_KEY as string;
  public isTeamGame = (!!process.env.TEAM_GAME &&
    (process.env.TEAM_GAME as string).toUpperCase() === 'TRUE') as boolean;
  public adminPassword = process.env.ADMIN_PASSWORD as string;
  public mongodbUri = process.env.MONGODB_URI as string;
  public mongoTest = process.env.MONGO_TEST as string;
  public sessionSecret = process.env.SESSION_SECRET as string;
  public port = process.env.PORT as string;
  public isPublishGames = (!!process.env.PUBLISH_GAMES &&
    (process.env.PUBLISH_GAMES as string).toUpperCase() === 'TRUE') as boolean;
  public envMessages = {
    en: (process.env.ENV_MESSAGE_EN ? JSON.parse(process.env.ENV_MESSAGE_EN as string) : {}) as EnvMessage,
    ja: (process.env.ENV_MESSAGE_JA ? JSON.parse(process.env.ENV_MESSAGE_JA as string) : {}) as EnvMessage
  };
}
