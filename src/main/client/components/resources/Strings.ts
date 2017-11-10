import { En } from './En';
import { Ja } from './Ja';

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
