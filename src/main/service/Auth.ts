import {EventEmitter} from 'events';

let win = (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this;

interface AuthResponse {
  authenticated: boolean;
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

  static login(userId?: string, pass?: string): Promise<boolean> {
    if (!userId && !pass) {
      return Promise.resolve(this.authenticated);
    }

    return fetch('/api/session', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        password: pass
      })
    }).then((res) => {
      return res.ok ? res.json() : Promise.reject('Api connection failed.');
    }).then((res: AuthResponse) => {
      if (!res.authenticated) {
        return Promise.reject('Authentication failed.');
      }

      this.authenticated = true;
    }).catch(() => {
      this.authenticated = false;
    }).then(() => {
      return this.authenticated;
    });
  }

  static logout(): Promise<{}> {
    this.authenticated = false;
    return Promise.resolve();
  }

  static addOnChangeListener(cb: (loggedIn: boolean) => void) {
    this.emitter.on('onchange', cb);
  }
}
