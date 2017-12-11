import { EventEmitter } from 'events';
import Auth from './Auth';
import { get, post, put, AbortSignal } from '../utils/fetch';

interface SignUpParameter {
  account: string;
  password: string;
  name: string;
  appKey: string;
  members: string[];
}

export default class User {
  public static emitter = new EventEmitter();

  public static select({ signal, account }: { signal?: AbortSignal; account?: string } = {}) {
    return get<UserResponse>(account ? `/api/user/${account}` : '/api/user', { signal });
  }

  public static all({ signal }: { signal?: AbortSignal } = {}) {
    return get<UserResponse[]>('/api/user/all', { signal });
  }

  public static recent({ signal }: { signal?: AbortSignal } = {}) {
    return get<UserResponse[]>('/api/user/recent', { signal });
  }

  public static async create({ signal, parameter }: { signal?: AbortSignal; parameter: SignUpParameter }) {
    return await post<ErrorResponse>('/api/user', { signal, body: parameter });
  }

  public static update({ signal, user }: { signal?: AbortSignal; user: UserResponse }) {
    return put('/api/user', { signal, body: user });
  }
}
