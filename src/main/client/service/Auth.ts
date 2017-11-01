import { EventEmitter } from 'events';
import { get, post, del, chain } from '../utils/fetch';

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

  public static login(account?: string, password?: string) {
    if (!account && !password) {
      return chain(get<AuthResponse>('/api/session'), (abortable) => {
        return abortable.then((res) => {
          this.authResponse = res;
        }).catch(() => {
          this.authResponse = { admin: false, authenticated: false };
        }).then(() => {
          return this.authResponse;
        });
      });
    }

    return chain(post('/api/session', { account, password }), (abortable) => {
      return abortable.then((res: AuthResponse) => {
        this.authResponse = res;
      }).catch(() => {
        this.authResponse = { admin: false, authenticated: false };
      }).then(() => {
        return this.authResponse;
      });
    });
  }

  public static logout() {
    this.authResponse = { admin: false, authenticated: false };
    return del('/api/session');
  }

  public static addOnChangeListener(cb: (authResponse: AuthResponse) => void) {
    this.emitter.on('onchange', cb);
  }

  public static removeOnChangeListener(cb: (authResponse: AuthResponse) => void) {
    this.emitter.removeListener('onchange', cb);
  }
}
