import { EventEmitter } from 'events';
import { get, post, del, AbortSignal } from '../utils/fetch';
import { AuthResponse } from '../../dts/AuthResponse';

export default class Auth {
  private static emitter = new EventEmitter();
  private static response: AuthResponse;
  public static get status() {
    return this.response;
  }

  public static set status(response: AuthResponse) {
    if (this.response !== response) {
      this.emitter.emit('onchange', response);
    }
    this.response = response;
  }

  public static async login({
    signal,
    account,
    password
  }: { signal?: AbortSignal; account?: string; password?: string } = {}) {
    try {
      this.status =
        !account && !password
          ? await get<AuthResponse>('/api/session', { signal })
          : await post<AuthResponse>('/api/session', { signal, body: { account, password } });
    } catch (error) {
      this.status = { admin: false, authenticated: false };
    }
    return this.status;
  }

  public static logout({ signal }: { signal?: AbortSignal } = {}) {
    this.status = { admin: false, authenticated: false };
    return del('/api/session', { signal });
  }

  public static addOnChangeListener(cb: (response: AuthResponse) => void) {
    this.emitter.on('onchange', cb);
  }

  public static removeOnChangeListener(cb: (response: AuthResponse) => void) {
    this.emitter.removeListener('onchange', cb);
  }
}
