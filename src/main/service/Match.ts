import {EventEmitter} from 'events';
import {UserModel} from './User';
import PublicConfig from '../PublicConfig';

export interface MatchModel {
  _id?: string;
  winner?: UserModel;
  contestants?: UserModel[];
}

export default class Match {
  static emitter = new EventEmitter();

  static create(against: string) {
    if (against) {
      return fetch(`/api/match/against/${against}`, { method: 'post', credentials: 'same-origin' }).then((res) => {
        return res.ok ? res.json() : Promise.reject('Api connection failed.');
      });
    }
    return Promise.reject('bad parameter userId: ' + against);
  }
  static select(matchId: string) {
    if (matchId) {
      return fetch(`/api/match/${matchId}`, { method: 'get', credentials: 'same-origin' }).then((res) => {
        return res.ok ? res.json() : Promise.reject('Api connection failed.');
      });
    }
    return Promise.reject('bad parameter userId: ' + matchId);
  }
}
