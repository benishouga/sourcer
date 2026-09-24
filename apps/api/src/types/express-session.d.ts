import { UserDocument } from '../models/UserModel';

declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
    admin?: boolean;
    user?: UserDocument | null;
  }
}
