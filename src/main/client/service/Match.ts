import { EventEmitter } from 'events';
import { post, get, AbortSignal } from '../utils/fetch';
import { GameDump } from '../../core/Dump';

export default class Match {
  public static emitter = new EventEmitter();

  public static matches(options?: { signal?: AbortSignal }) {
    let signal;
    if (options) {
      signal = options.signal;
    }
    return get<MatchResponse[]>(`/api/match/`, { signal });
  }
  public static create({ signal, against }: { signal?: AbortSignal; against: string }) {
    if (!against) {
      throw new Error('bad parameter against: ' + against);
    }
    return post<MatchResponse>(`/api/match/against/${against}`, { signal });
  }
  public static official({ player1, player2, signal }: { player1: string; player2: string; signal?: AbortSignal }) {
    if (!player1 || !player2) {
      throw new Error('bad parameter player: ' + player1 + ', ' + player2);
    }
    return post<MatchResponse>(`/api/match/official/${player1}/${player2}`, { signal });
  }
  public static replay({ matchId, signal }: { matchId: string; signal?: AbortSignal }) {
    if (!matchId) {
      throw new Error('bad parameter matchId: ' + matchId);
    }
    return get<GameDump>(`/api/replay/${matchId}`, { signal });
  }
  public static select({ matchId, signal }: { matchId: string; signal?: AbortSignal }) {
    if (!matchId) {
      throw new Error('bad parameter matchId: ' + matchId);
    }
    return get<MatchResponse>(`/api/match/${matchId}`, { signal });
  }
}
