import {EventEmitter} from 'events';
import PublicConfig from '../PublicConfig';
import {post, get} from '../utils/fetch';
import {GameDump} from '../core/Dump';

export default class Match {
  static emitter = new EventEmitter();

  static create(against: string) {
    if (!against) {
      throw 'bad parameter against: ' + against;
    }
    return post(`/api/match/against/${against}`, {});
  }
  static getDump(matchId: string) {
    if (!matchId) {
      throw 'bad parameter matchId: ' + matchId;
    }
    return get<GameDump>(`/api/match/${matchId}`);
  }
}
