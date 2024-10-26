import { useState, useEffect } from 'react';
import { get } from '../utils/fetch';
import { ConfigResponse } from '../../dts/ConfigResponse';
import { EnvMessage } from '../../dts/StringResource';

const useConfig = () => {
  const [response, setResponse] = useState<ConfigResponse>({
    requireAppKey: false,
    teamGame: false,
    envMessages: {},
    publishGames: false,
    displayLanguage: 'en'
  });

  const load = async () => {
    const configResponse = await get<ConfigResponse>('/api/config');
    setResponse(configResponse);
  };

  const strings = (lang?: string): EnvMessage => {
    const v = response;
    const stringsForLang = v.envMessages[lang || navigator.language];
    if (stringsForLang) {
      return stringsForLang;
    }
    return v.envMessages.en; // default 'en'
  };

  useEffect(() => {
    load();
  }, []);

  return { response, strings };
};

export default useConfig;
