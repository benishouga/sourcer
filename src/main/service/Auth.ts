import {EventEmitter} from 'events';
import {get, post, chain} from '../utils/fetch';

interface AuthResponse {
  authenticated: boolean;
  initialized: boolean;
}

export default class Auth {
  static emitter = new EventEmitter();
  static _authenticated: boolean = false;
  static get authenticated() {
    return this._authenticated;
  }

  static set authenticated(authenticated: boolean) {
    if (this._authenticated !== authenticated) {
      this.emitter.emit('onchange', authenticated);
    }
    this._authenticated = authenticated;
  }

  static login(account?: string, pass?: string) {
    if (!account && !pass) {
      return chain(get<AuthResponse>('/api/session'), (abortable) => {
        return abortable.then((res) => {
          this.authenticated = res.authenticated;
        }).catch(() => {
          this.authenticated = false;
        }).then(() => {
          return this.authenticated;
        });
      });
    }

    return chain(post('/api/session', {
      account: account,
      password: pass
    }), (abortable) => {
      return abortable.then((res: AuthResponse) => {
        this.authenticated = res.authenticated;
      }).catch(() => {
        this.authenticated = false;
      }).then(() => {
        return this.authenticated;
      });
    });
  }

  static logout(): Promise<{}> {
    this.authenticated = false;
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
