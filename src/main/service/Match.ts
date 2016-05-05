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
  static official(player1: string, player2: string) {
    if (!player1 || !player2) {
      throw 'bad parameter player: ' + player1 + ', ' + player2;
    }
    return post(`/api/match/official/${player1}/${player2}`, {});
  }
  static replay(matchId: string) {
    if (!matchId) {
      throw 'bad parameter matchId: ' + matchId;
    }
    return get<GameDump>(`/api/replay/${matchId}`);
  }
  static select(matchId: string) {
    if (!matchId) {
      throw 'bad parameter matchId: ' + matchId;
    }
    return get<MatchResponse>(`/api/match/${matchId}`);
  }
}
