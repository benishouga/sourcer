import {EventEmitter} from 'events';
import {get, post, chain} from '../utils/fetch';

export default class Auth {
  static emitter = new EventEmitter();
  static _authResponse: AuthResponse = { admin: false, authenticated: false };
  static get authResponse() {
    return this._authResponse;
  }

  static set authResponse(authResponse: AuthResponse) {
    if (this._authResponse !== authResponse) {
      this.emitter.emit('onchange', authResponse);
    }
    this._authResponse = authResponse;
  }

  static login(account?: string, pass?: string) {
    if (!account && !pass) {
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

    return chain(post('/api/session', {
      account: account,
      password: pass
    }), (abortable) => {
      return abortable.then((res: AuthResponse) => {
        this.authResponse = res;
      }).catch(() => {
        this.authResponse = { admin: false, authenticated: false };
      }).then(() => {
        return this.authResponse;
      });
    });
  }

  static logout(): Promise<{}> {
    this.authResponse = { admin: false, authenticated: false };
    return post('/api/session', {
      method: 'delete',
      credentials: 'same-origin'
    });
  }

  static addOnChangeListener(cb: (authResponse: AuthResponse) => void) {
    this.emitter.on('onchange', cb);
  }

  static removeOnChangeListener(cb: (authResponse: AuthResponse) => void) {
    this.emitter.removeListener('onchange', cb);
  }
}
