import { EventEmitter } from 'events';
import { post, get } from '../utils/fetch';
import { GameDump } from '../../core/Dump';

export default class Match {
  public static emitter = new EventEmitter();

  public static create(against?: string) {
    if (!against) {
      throw new Error('bad parameter against: ' + against);
    }
    return post(`/api/match/against/${against}`, {});
  }
  public static official(player1: string, player2: string) {
    if (!player1 || !player2) {
      throw new Error('bad parameter player: ' + player1 + ', ' + player2);
    }
    return post(`/api/match/official/${player1}/${player2}`, {});
  }
  public static replay(matchId?: string) {
    if (!matchId) {
      throw new Error('bad parameter matchId: ' + matchId);
    }
    return get<GameDump>(`/api/replay/${matchId}`);
  }
  public static select(matchId: string) {
    if (!matchId) {
      throw new Error('bad parameter matchId: ' + matchId);
    }
    return get<MatchResponse>(`/api/match/${matchId}`);
  }
}
