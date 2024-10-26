import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, HeaderRow, Navigation, Content, Icon } from 'react-mdl';
import * as moment from 'moment';

import { strings } from '../resources/Strings';

import Auth from '../../service/Auth';
import { AuthResponse } from '../../../dts/AuthResponse';

import 'moment/locale/ja';
moment.locale([navigator.language, 'en']);

const App: React.FC = ({ children }) => {
  const [authResponse, setAuthResponse] = useState<AuthResponse>(Auth.status);

  useEffect(() => {
    const updateAuth = (authResponse: AuthResponse) => {
      setAuthResponse(authResponse);
    };

    Auth.addOnChangeListener(updateAuth);
    return () => {
      Auth.removeOnChangeListener(updateAuth);
    };
  }, []);

  const resource = strings();
  return (
    <div className="mdl-layout mdl-layout--fixed-header is-upgraded">
      <Header scroll>
        <HeaderRow title={<Link to={authResponse.admin ? '/official' : '/'}>Sourcer</Link>}>
          <Navigation>
            {authResponse.admin ? (
              <Link to="/official">
                <Icon name="whatshot" />
                <span className="optional-label"> {resource.officialMatch}</span>
              </Link>
            ) : null}
            {authResponse.authenticated && !authResponse.admin ? (
              <Link to="/edit">
                <Icon name="edit" />
                <span className="optional-label"> {resource.writeCode}</span>
              </Link>
            ) : null}
            {authResponse.authenticated ? (
              <Link to="/logout">
                <Icon name="open_in_new" />
                <span className="optional-label"> {resource.logout}</span>
              </Link>
            ) : (
              <Link to="/login">
                <Icon name="input" />
                <span className="optional-label"> {resource.login}</span>
              </Link>
            )}
            {!authResponse.authenticated ? (
              <Link to="/signup">
                <Icon name="create" />
                <span className="optional-label"> {resource.signUp}</span>
              </Link>
            ) : null}
            <a target="_new" href={resource.apiUrl}>
              <Icon name="help" />
              <span className="optional-label"> {resource.apiDocument}</span>
            </a>
            <a target="_new" className="mdl-navigation__link" href="https://github.com/benishouga/sourcer">
              <img src="/github.png" width="22" height="22" />
              <span className="optional-label"> Github</span>
            </a>
          </Navigation>
        </HeaderRow>
      </Header>
      <Content className="scr-main">{children}</Content>
    </div>
  );
};

export default App;
