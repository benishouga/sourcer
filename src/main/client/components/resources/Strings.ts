import { En } from './En';
import { Ja } from './Ja';
import { StringResource } from '../../../dts/StringResource';
import Config from '../../service/Config';

const stringsMap: { [key: string]: StringResource } = {
  en: new En(),
  ja: new Ja()
};

export function strings(lang?: string): StringResource {
  const envLang = Config.values.displayLanguage;
  const stringsForLang = stringsMap[lang || envLang !== 'auto' ? envLang : navigator.language];
  if (stringsForLang) {
    return stringsForLang;
  }
  return stringsMap.en; // default 'en'
}
