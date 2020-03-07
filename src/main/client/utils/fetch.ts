interface Option {
  query?: { [key: string]: string };
  body?: any;
  signal?: AbortSignal;
}

function querystring(query?: { [key: string]: string }) {
  if (!query) {
    return '';
  }
  const keyvalues = Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');
  return `?${keyvalues}`;
}

async function send<T>(method: string, url: string, { query, body, signal }: Option = {}): Promise<T> {
  const headers: { [key: string]: string } = { Accept: 'application/json' };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url + querystring(query), {
    method,
    headers,
    signal,
    body: JSON.stringify(body),
    mode: 'same-origin',
    credentials: 'include'
  });
  return await res.json();
}

export function get<T>(url: string, options: { signal?: AbortSignal; query?: { [key: string]: string } } = {}) {
  return send<T>('GET', url, options);
}

export function post<T>(
  url: string,
  options: { signal?: AbortSignal; query?: { [key: string]: string }; body?: any } = {}
) {
  return send<T>('POST', url, options);
}

export function put<T>(
  url: string,
  options: { signal?: AbortSignal; query?: { [key: string]: string }; body?: any } = {}
) {
  return send<T>('PUT', url, options);
}

export function del<T>(url: string, options: { signal?: AbortSignal; query?: { [key: string]: string } } = {}) {
  return send<T>('DELETE', url, options);
}
