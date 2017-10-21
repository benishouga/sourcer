import * as sa from 'superagent';

export function chain<U, R>(abortable: RequestPromise<R>, internal: (abortable: RequestPromise<R>) => Promise<U>): RequestPromise<U> {
  const all = internal(abortable);
  return {
    then: all.then.bind(all),
    catch: all.catch.bind(all),
    abort: abortable.abort.bind(abortable)
  };
}

interface Option {
  query?: { [key: string]: string; };
  body?: any;
}

export interface RequestPromise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
  abort(): void;
}

function send<T>(request: sa.Request, option?: Option): RequestPromise<T> {
  request.accept('application/json');
  if (option && option.query) {
    request.query(option.query);
  }

  if (option && option.body) {
    request.set({ 'Content-Type': 'application/json' });
    request.send(option.body);
  }

  const promise = new Promise<T>((resolve, reject) => {
    request.end((err, res) => {
      return err ? reject(err) : resolve(res.body);
    });
  });

  return {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    abort: request.abort.bind(request)
  };
}

export function get<T>(url: string, query?: { [key: string]: string }) {
  return send<T>(sa.get(url), { query });
}

export function post<T>(url: string, body?: any) {
  return send<T>(sa.post(url), { body });
}

export function put<T>(url: string, body: any) {
  return send<T>(sa.put(url), { body });
}

export function del<T>(url: string, query?: { [key: string]: string }) {
  return send<T>(sa.del(url), { query });
}
