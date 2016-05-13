import * as React from 'react';
import {Link} from 'react-router';
import {Header, HeaderRow, Navigation, Spacer, Content, Grid, Cell, Footer, FooterSection, FooterLinkList, Icon} from 'react-mdl';
import * as moment from 'moment';

import {strings} from '../resources/Strings';

import Auth from '../../service/Auth';

require('moment/locale/ja');
moment.locale('ja');

interface AppContext {
  router: ReactRouter.RouterOnContext;
}

interface AppProps extends React.Props<App> {
  context: AppContext;
}

interface AppState {
  authResponse: AuthResponse
}

export default class App extends React.Component<AppProps, AppState> {
  constructor() {
    super();
    this.state = {
      authResponse: Auth.authResponse
    };
  }

  updateAuth = (authResponse: AuthResponse) => {
    this.setState({
      authResponse: authResponse
    });
  };

  componentWillMount() {
    Auth.addOnChangeListener(this.updateAuth);

    Auth.login().then((authInfo) => {
      this.updateAuth(authInfo);
    });
  }

  componentWillUnmount() {
    Auth.removeOnChangeListener(this.updateAuth);
  }

  render() {
    let resource = strings();
    return (
      <div className="mdl-layout mdl-layout--fixed-header is-upgraded">
        <Header scroll>
          <HeaderRow title={<Link to={this.state.authResponse.admin ? '/official' : '/'}>Sourcer</Link>}>
            <Navigation>
              {
                this.state.authResponse.admin ?
                  <Link to="/official"><Icon name="whatshot" /> {resource.official_match}</Link> : null
              }
              {
                this.state.authResponse.authenticated && !this.state.authResponse.admin ?
                  <Link to="/edit"><Icon name="edit" /> {resource.write_code}</Link> : null
              }
              {
                this.state.authResponse.authenticated ?
                  (<Link to="/logout"><Icon name="open_in_new" /> {resource.logout}</Link>) :
                  (<Link to="login"><Icon name="input" /> {resource.login}</Link>)
              }
              {
                !this.state.authResponse.authenticated ?
                  (<Link to="/signup"><Icon name="create" /> {resource.sign_up}</Link>) : null
              }
              <a target="_new" href="/docs.html"><Icon name="help" /> {resource.api_document}</a>
            </Navigation>
          </HeaderRow>
        </Header>
        <Content>
          <Grid>
            <Cell col={1} hideTablet hidePhone />
            <Cell col={10} tablet={12} phone={12}>
              {this.props.children}
            </Cell>
          </Grid>
        </Content>
      </div>
    );
  }
}
