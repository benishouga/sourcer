export interface StringResource {
  none: string;
  apiDocument: string;
  writeCode: string;
  login: string;
  logout: string;
  signUp: string;
  save: string;
  loading: string;
  badRequest: string;
  loginTitle: string;
  signUpTitle: string;
  fieldLabelAccount: string;
  fieldLabelPassword: string;
  fieldLabelName: string;
  fieldLabelNameForTeamGame: string;
  fieldLabelMember: string[];
  fieldLabelAppKey: string;
  logoutMessage: string;
  fight: string;
  fighting: string;
  members: string;
  serviceDescription: string;
  serviceBenefit: string;
  wins: string;
  losses: string;
  matchesTitle: string;
  updatedAt: string;
  viewMatch: string;
  recentUpdatedUsersTitle: string;
  officialMatch: string;
  shield: string;
  fuel: string;
  temperature: string;
  ammo: string;
  test: string;
  saved: string;
  saveAndFindAgainst: string;
  selectEnemy: string;
  fiddle: string;
  fewAttack: string;
  fewMissile: string;
  escape: string;
  attacksFromLow: string;
  standard: string;
  viewCode: string;
  reselect: string;
  returnTop: string;
  apiUrl: string;
  invalidAccountTooShort: string;
  invalidAccountCharacterClass: string;
  invalidAccountReserved: string;
  invalidAccountExist: string;
  invalidPasswordTooShort: string;
  invalidNameEmpty: string;
  invalidNameTooLong: string;
  invalidTeamNameEmpty: string;
  invalidTeamNameTooLong: string;
}

type ResourceId = keyof StringResource;

export interface EnvMessage {
  topMessage?: string;
}
