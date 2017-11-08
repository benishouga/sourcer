import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header, HeaderRow, Navigation, Spacer, Content, Grid, Cell, Footer, FooterSection, FooterLinkList, Icon } from 'react-mdl';
import * as moment from 'moment';

import { strings } from '../resources/Strings';

import Auth from '../../service/Auth';

import 'moment/locale/ja';
moment.locale('ja');

interface AppState {
  authResponse: AuthResponse;
}

export default class App extends React.Component<{}, AppState> {
  constructor() {
    super();
    this.state = {
      authResponse: Auth.status
    };
  }

  private updateAuth = (authResponse: AuthResponse) => {
    this.setState({ authResponse });
  }

  public componentWillMount() {
    Auth.addOnChangeListener(this.updateAuth);
  }

  public componentWillUnmount() {
    Auth.removeOnChangeListener(this.updateAuth);
  }

  public render() {
    const resource = strings();
    return (
      <div className="mdl-layout mdl-layout--fixed-header is-upgraded">
        <Header scroll>
          <HeaderRow title={<Link to={this.state.authResponse.admin ? '/official' : '/'}>Sourcer</Link>}>
            <Navigation>
              {
                this.state.authResponse.admin ?
                  <Link to="/official"><Icon name="whatshot" /> {resource.officialMatch}</Link> : null
              }
              {
                this.state.authResponse.authenticated && !this.state.authResponse.admin ?
                  <Link to="/edit"><Icon name="edit" /> {resource.writeCode}</Link> : null
              }
              {
                this.state.authResponse.authenticated ?
                  (<Link to="/logout"><Icon name="open_in_new" /> {resource.logout}</Link>) :
                  (<Link to="login"><Icon name="input" /> {resource.login}</Link>)
              }
              {
                !this.state.authResponse.authenticated ?
                  (<Link to="/signup"><Icon name="create" /> {resource.signUp}</Link>) : null
              }
              <a target="_new" href="http://benishouga.github.io/sourcer/"><Icon name="help" /> {resource.apiDocument}</a>
            </Navigation>
          </HeaderRow>
        </Header>
        <Content className="scr-main">
          {this.props.children}
        </Content>
      </div>
    );
  }
}
