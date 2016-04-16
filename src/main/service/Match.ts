import {EventEmitter} from 'events';
import {UserModel} from './User';

export interface MatchModel {
  _id?: string;
  winner?: UserModel;
  contestants?: UserModel[];
}

export default class Match {
  static emitter = new EventEmitter();
}
