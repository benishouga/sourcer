import { En } from './En';
import { Ja } from './Ja';

export interface StringResource {
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
  fieldLabelMember1: string;
  fieldLabelMember2: string;
  fieldLabelMember3: string;
  fieldLabelMember4: string;
  fieldLabelMember5: string;
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
  fixedBattery: string;
  standard: string;
  viewCode: string;
  reselect: string;
}

const stringsMap: { [key: string]: StringResource } = {
  en: new En(),
  ja: new Ja()
};

export function strings(lang?: string): StringResource {
  const stringsForLang = stringsMap[lang || navigator.language];
  if (stringsForLang) {
    return stringsForLang;
  }
  return stringsMap.en; // default 'en'
}
