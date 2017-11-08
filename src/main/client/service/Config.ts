import { EventEmitter } from 'events';
import { get, post, del, AbortSignal } from '../utils/fetch';

export default class Config {
  private static response: ConfigResponse;
  public static get values() {
    return this.response;
  }
  public static async load() {
    this.response = await get<ConfigResponse>('/api/config');
  }
}
