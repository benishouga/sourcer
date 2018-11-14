import { En } from './En';
import { Ja } from './Ja';
import { StringResource } from '../../../dts/StringResource';
import Config from '../../service/Config';

const stringsMap: { [key: string]: StringResource } = {
  en: new En(),
  ja: new Ja()
};

export function strings(argLanguage?: string): StringResource {
  const envLang = Config.values && Config.values.displayLanguage;
  const language = argLanguage || (envLang && envLang !== 'auto') ? envLang : navigator.language.split('-')[0];
  const stringsForLang = stringsMap[language];
  if (stringsForLang) {
    return stringsForLang;
  }
  return stringsMap.en; // default 'en'
}
