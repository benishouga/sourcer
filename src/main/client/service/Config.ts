import { get } from '../utils/fetch';

export default class Config {
  private static response: ConfigResponse;
  public static get values() {
    return this.response;
  }
  public static strings(lang?: string): EnvMessage {
    const v = this.values;
    const stringsForLang = v.envMessages[lang || navigator.language];
    if (stringsForLang) {
      return stringsForLang;
    }
    return v.envMessages.en; // default 'en'
  }
  public static async load() {
    this.response = await get<ConfigResponse>('/api/config');
  }
}
