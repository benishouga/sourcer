import * as sa from 'superagent';

export function chain<U, R>(abortable: RequestPromise<R>, internal: (abortable: RequestPromise<R>) => Promise<U>): RequestPromise<U> {
  let all = internal(abortable);
  return {
    then: all.then.bind(all),
    catch: all.catch.bind(all),
    abort: abortable.abort.bind(abortable),
  };
}

interface Option {
  query?: { [key: string]: string; };
  body?: any;
}

export interface RequestPromise<R> {
  then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
  then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => void): Promise<U>;
  catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
  abort(): void;
}

function send<T>(request: sa.Request<any>, option?: Option): RequestPromise<T> {
  request.accept('application/json');
  if (option && option.query) {
    request.query(option.query);
  }

  if (option && option.body) {
    request.set({ 'Content-Type': 'application/json' });
    request.send(option.body);
  }

  let promise = new Promise<T>((resolve, reject) => {
    request.end((err, res) => {
      return err ? reject(err) : resolve(res.body);
    });
  });

  return {
    'then': promise.then.bind(promise),
    'catch': promise.catch.bind(promise),
    'abort': request.abort.bind(request)
  };
}

export function get<T>(url: string, query?: { [key: string]: string }) {
  return send<T>(sa.get(url), { query: query });
}

export function post<T>(url: string, body?: any) {
  return send<T>(sa.post(url), { body: body });
}

export function put<T>(url: string, body: any) {
  return send<T>(sa.put(url), { body: body });
}

export function del<T>(url: string, query?: { [key: string]: string }) {
  return send<T>(sa.del(url), { query: query });
}
