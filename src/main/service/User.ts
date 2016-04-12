import {EventEmitter} from 'events';

interface UserModel {
  account: string;
  source: string;
  matches: MatchModel[];
}

interface MatchModel {
  _id: string;
  winner: UserModel;
  contestants: UserModel[];
}

export default class User {
  static emitter = new EventEmitter();
  static _user: UserModel = null;
  static get user() {
    return this._user;
  }

  static set user(user: UserModel) {
    this.emitter.emit('onchange', user);
    this._user = user;
  }

  static select(userId?: string): Promise<UserModel> {
    if (userId) {
      return fetch(`/api/user/${userId}`, { method: 'get', credentials: 'same-origin' }).then((res) => {
        return res.ok ? res.json() : Promise.reject('Api connection failed.');
      }).then((res: UserModel) => {
        this.user = res;
        return this.user;
      });
    }
    return fetch('/api/user', { method: 'get', credentials: 'same-origin' }).then((res) => {
      return res.ok ? res.json() : Promise.reject('Api connection failed.');
    }).then((res: UserModel) => {
      this.user = res;
      return this.user;
    });
  }

  static update(user: UserModel): Promise<{}> {
    return fetch('/api/user', {
      method: 'post',
      credentials: 'same-origin'
    });
  }

  static addOnChangeListener(cb: (user: UserModel) => void) {
    this.emitter.on('onchange', cb);
  }
}
