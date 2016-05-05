import {EventEmitter} from 'events';
import Auth from './Auth';
import {get, post, put} from '../utils/fetch';

interface SignUpParameter {
  account: string;
  password: string;
  name: string;
  appKey: string;
  members: string[];
}

export default class User {
  static emitter = new EventEmitter();

  static select(account?: string) {
    return get<UserResponse>(account ? `/api/user/${account}` : '/api/user');
  }

  static all() {
    return get<UserResponse[]>('/api/user/all');
  }

  static recent() {
    return get<UserResponse[]>('/api/user/recent');
  }

  static create(parameter: SignUpParameter) {
    return post('/api/user', parameter).then(() => {
      return Auth.login();
    });
  }

  static update(user: UserResponse) {
    return put('/api/user', user);
  }
}
