import {EventEmitter} from 'events';
import {UserModel} from './User';

export interface MatchModel {
  _id?: string;
  winner?: UserModel;
  contestants?: UserModel[];
}

export default class Match {
  static emitter = new EventEmitter();

  static create(userId: string) {
    if (userId) {
      return fetch(`/api/match/against/${userId}`, { method: 'post', credentials: 'same-origin' }).then((res) => {
        return res.ok ? res.json() : Promise.reject('Api connection failed.');
      });
    }
  }
}
