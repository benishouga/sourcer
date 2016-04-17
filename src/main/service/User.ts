import {EventEmitter} from 'events';
import {MatchModel} from './Match';

export interface UserModel {
  account?: string;
  source?: string;
  matches?: MatchModel[];
  update?: Date;
}

export default class User {
  static emitter = new EventEmitter();

  static select(userId?: string): Promise<UserModel> {
    if (userId) {
      return fetch(`/api/user/${userId}`, { method: 'get', credentials: 'same-origin' }).then((res) => {
        return res.ok ? res.json() : Promise.reject('Api connection failed.');
      });
    }
    return fetch('/api/user', { method: 'get', credentials: 'same-origin' }).then((res) => {
      return res.ok ? res.json() : Promise.reject('Api connection failed.');
    });
  }

  static recent(): Promise<UserModel[]> {
    return fetch(`/api/user/recent`, { method: 'get', credentials: 'same-origin' }).then((res) => {
      return res.ok ? res.json() : Promise.reject('Api connection failed.');
    });
  }

  static update(user: UserModel): Promise<UserModel> {
    return fetch('/api/user', {
      method: 'put',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ source: user.source })
    }).then((res) => {
      return res.ok ? res.json() : Promise.reject('User update failed.');
    });
  }
}
