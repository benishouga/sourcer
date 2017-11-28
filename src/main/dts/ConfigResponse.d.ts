interface ConfigResponse {
  requireAppKey: boolean;
  teamGame: boolean;
  envMessages: { [key: string]: EnvMessage; };
}
