import {EventEmitter} from 'events';
import {get, post, chain} from '../utils/fetch';

interface AuthResponse {
  authenticated: boolean;
  admin: boolean;
}

export default class Auth {
  static emitter = new EventEmitter();
  static _authenticated: AuthResponse = { admin: false, authenticated: false };
  static get info() {
    return this._authenticated;
  }

  static set info(authenticated: AuthResponse) {
    if (this._authenticated !== authenticated) {
      this.emitter.emit('onchange', authenticated);
    }
    this._authenticated = authenticated;
  }

  static login(account?: string, pass?: string) {
    if (!account && !pass) {
      return chain(get<AuthResponse>('/api/session'), (abortable) => {
        return abortable.then((res) => {
          this.info = res;
        }).catch(() => {
          this.info = { admin: false, authenticated: false };
        }).then(() => {
          return this.info;
        });
      });
    }

    return chain(post('/api/session', {
      account: account,
      password: pass
    }), (abortable) => {
      return abortable.then((res: AuthResponse) => {
        this.info = res;
      }).catch(() => {
        this.info = { admin: false, authenticated: false };
      }).then(() => {
        return this.info;
      });
    });
  }

  static logout(): Promise<{}> {
    this.info = { admin: false, authenticated: false };
    return post('/api/session', {
      method: 'delete',
      credentials: 'same-origin'
    });
  }

  static addOnChangeListener(cb: (loggedIn: boolean) => void) {
    this.emitter.on('onchange', cb);
  }

  static removeOnChangeListener(cb: (loggedIn: boolean) => void) {
    this.emitter.removeListener('onchange', cb);
  }
}
