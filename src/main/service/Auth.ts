import {EventEmitter} from 'events';

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

  static create(userId: string, pass: string, appKey: string): Promise<boolean> {
    return fetch('/api/user', {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        password: pass,
        appKey: appKey
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

  static login(userId?: string, pass?: string): Promise<boolean> {
    if (!userId && !pass) {
      return fetch('/api/session', { credentials: 'same-origin' }).then((res) => {
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

    return fetch('/api/session', {
      method: 'post',
      credentials: 'same-origin',
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
