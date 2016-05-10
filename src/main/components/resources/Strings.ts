import {En} from './En';
import {Ja} from './Ja';

export interface StringResource {
  api_document: string;
  write_code: string;
  login: string;
  logout: string;
  sign_up: string;
  save: string;
  loading: string;
  bad_request: string;
  login_title: string;
  sign_up_title: string;
  field_label_account: string;
  field_label_password: string;
  field_label_name: string;
  field_label_member1: string;
  field_label_member2: string;
  field_label_member3: string;
  field_label_member4: string;
  field_label_member5: string;
  field_label_app_key: string;
  logout_message: string;
  fight: string;
  fighting: string;
  members: string;
  service_description: string;
  service_benefit: string;
  wins: string;
  losses: string;
  matches_title: string;
  updated_at: string;
  view_match: string;
  recent_updated_users_title: string;
  official_match: string;
  shield: string;
  fuel: string;
  temperature: string;
  ammo: string;
}

let stringsMap: { [key: string]: StringResource } = {
  en: new En(),
  ja: new Ja()
};

export function strings(lang?: string): StringResource {
  let strings = stringsMap[lang || navigator.language];
  if (strings) {
    return strings;
  }
  return stringsMap['en']; // default 'en'
}
