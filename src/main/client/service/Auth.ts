import { useState, useEffect } from 'react';
import { get, post, del } from '../utils/fetch';
import { AuthResponse } from '../../dts/AuthResponse';

const useAuth = () => {
  const [response, setResponse] = useState<AuthResponse>({ admin: false, authenticated: false });

  const login = async ({ signal, account, password }: { signal?: AbortSignal; account?: string; password?: string } = {}) => {
    try {
      const authResponse = !account && !password
        ? await get<AuthResponse>('/api/session', { signal })
        : await post<AuthResponse>('/api/session', { signal, body: { account, password } });
      setResponse(authResponse);
    } catch (error) {
      setResponse({ admin: false, authenticated: false });
    }
  };

  const logout = async ({ signal }: { signal?: AbortSignal } = {}) => {
    setResponse({ admin: false, authenticated: false });
    await del('/api/session', { signal });
  };

  useEffect(() => {
    const handleChange = (newResponse: AuthResponse) => {
      setResponse(newResponse);
    };

    Auth.addOnChangeListener(handleChange);
    return () => {
      Auth.removeOnChangeListener(handleChange);
    };
  }, []);

  return { response, login, logout };
};

export default useAuth;
