import {EventEmitter} from 'events';
import Auth from './Auth';

interface SignUpParameter {
  account: string;
  password: string;
  name: string;
  appKey: string;
  members: string[];
}

export default class User {
  static emitter = new EventEmitter();

  static select(account?: string): Promise<UserResponse> {
    if (account) {
      return fetch(`/api/user/${account}`, { method: 'get', credentials: 'same-origin' }).then((res) => {
        return res.ok ? res.json() : Promise.reject('Api connection failed.');
      });
    }
    return fetch('/api/user', { method: 'get', credentials: 'same-origin' }).then((res) => {
      return res.ok ? res.json() : Promise.reject('Api connection failed.');
    });
  }

  static recent(): Promise<UserResponse[]> {
    return fetch(`/api/user/recent`, { method: 'get', credentials: 'same-origin' }).then((res) => {
      return res.ok ? res.json() : Promise.reject('Api connection failed.');
    });
  }

  static create(parameter: SignUpParameter): Promise<boolean> {
    return fetch('/api/user', {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parameter)
    }).then((res) => {
      return res.ok ? Auth.login() : Promise.reject(res.status);
    }).catch(() => {
      return false;
    });
  }

  static update(user: UserResponse): Promise<UserResponse> {
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
