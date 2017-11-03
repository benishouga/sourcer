import * as sa from 'superagent';
import { EventEmitter } from 'events';

export class AbortSignal extends EventEmitter {
  public aborted = false;
}

export class AbortController {
  public signal: AbortSignal;
  constructor() {
    this.signal = new AbortSignal();
  }

  public abort() {
    this.signal.aborted = true;
    this.signal.emit('abort');
  }
}

interface Option {
  query?: { [key: string]: string; };
  body?: any;
  signal?: AbortSignal;
}

function send<T>(request: sa.Request, { query, body, signal }: Option = {}): Promise<T> {
  request.accept('application/json');
  request.withCredentials();
  if (query) {
    request.query(query);
  }

  if (body) {
    request.set({ 'Content-Type': 'application/json' });
    request.send(body);
  }

  return new Promise<T>((resolve, reject) => {
    let abortHandler: () => void;
    if (signal) {
      if (signal.aborted) {
        const error = new Error('Aborted');
        error.name = 'AbortError';
        return reject(error);
      }

      abortHandler = () => {
        const error = new Error('Aborted');
        error.name = 'AbortError';
        reject(error);
        request.abort();
        signal.removeListener('abort', abortHandler);
      };
      signal.on('abort', abortHandler);
    }

    request.end((err, res) => {
      if (signal) {
        signal.removeListener('abort', abortHandler);
      }
      return err ? reject(err) : resolve(res.body);
    });
  });
}

export function get<T>(url: string, options: { signal?: AbortSignal, query?: { [key: string]: string } } = {}) {
  return send<T>(sa.get(url), { ...options });
}

export function post<T>(url: string, options: { signal?: AbortSignal, query?: { [key: string]: string }, body?: any } = {}) {
  return send<T>(sa.post(url), { ...options });
}

export function put<T>(url: string, options: { signal?: AbortSignal, query?: { [key: string]: string }, body?: any } = {}) {
  return send<T>(sa.put(url), { ...options });
}

export function del<T>(url: string, options: { signal?: AbortSignal, query?: { [key: string]: string } } = {}) {
  return send<T>(sa.del(url), { ...options });
}
