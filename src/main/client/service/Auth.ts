import { EventEmitter } from 'events';
import { get, post, del, AbortSignal } from '../utils/fetch';

export default class Auth {
  public static emitter = new EventEmitter();
  private static response: AuthResponse;
  public static get authResponse() {
    return this.response;
  }

  public static set authResponse(authResponse: AuthResponse) {
    if (this.response !== authResponse) {
      this.emitter.emit('onchange', authResponse);
    }
    this.response = authResponse;
  }

  public static async login({ signal, account, password }: { signal?: AbortSignal, account?: string, password?: string } = {}) {
    try {
      let authResponse: AuthResponse;
      if (!account && !password) {
        authResponse = await get<AuthResponse>('/api/session', { signal });
      } else {
        authResponse = await post<AuthResponse>('/api/session', { signal, body: { account, password } });
      }
      this.authResponse = authResponse;
    } catch (error) {
      this.authResponse = { admin: false, authenticated: false };
    }
    return this.authResponse;
  }

  public static logout({ signal }: { signal?: AbortSignal } = {}) {
    this.authResponse = { admin: false, authenticated: false };
    return del('/api/session', { signal });
  }

  public static addOnChangeListener(cb: (authResponse: AuthResponse) => void) {
    this.emitter.on('onchange', cb);
  }

  public static removeOnChangeListener(cb: (authResponse: AuthResponse) => void) {
    this.emitter.removeListener('onchange', cb);
  }
}
