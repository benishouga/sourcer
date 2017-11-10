export default class Env {
  public static appKey = process.env.APP_KEY as string;
  public static isTeamGame = (!!process.env.TEAM_GAME && (process.env.TEAM_GAME as string).toUpperCase() === 'TRUE') as boolean;
  public static adminPassword = process.env.ADMIN_PASSWORD as string;
  public static mongodbUri = process.env.MONGODB_URI as string;
  public static mongoTest = process.env.MONGO_TEST as string;
  public static sessionSecret = process.env.SESSION_SECRET as string;
  public static port = process.env.PORT as string;
}
