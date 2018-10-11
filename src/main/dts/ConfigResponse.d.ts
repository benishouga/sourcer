import { EnvMessage } from './StringResource';

export interface ConfigResponse {
  requireAppKey: boolean;
  teamGame: boolean;
  envMessages: { [key: string]: EnvMessage };
  publishGames: boolean;
}
