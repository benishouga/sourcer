import {EventEmitter} from 'events';

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

  static login(account?: string, pass?: string): Promise<boolean> {
    if (!account && !pass) {
      return fetch('/api/session', { credentials: 'same-origin' }).then((res) => {
        return res.ok ? res.json() : Promise.reject(res.status);
      }).then((res: AuthResponse) => {
        this.authenticated = res.authenticated;
      }).catch(() => {
        this.authenticated = false;
      }).then(() => {
        return this.authenticated;
      });
    }

    return fetch('/api/session', {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: account,
        password: pass
      })
    }).then((res) => {
      return res.ok ? res.json() : Promise.reject(res.status);
    }).then((res: AuthResponse) => {
      this.authenticated = res.authenticated;
    }).catch(() => {
      this.authenticated = false;
    }).then(() => {
      return this.authenticated;
    });
  }

  static logout(): Promise<{}> {
    this.authenticated = false;
    return fetch('/api/session', {
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
