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
  loggedIn: boolean
}

export default class App extends React.Component<AppProps, AppState> {
  constructor() {
    super();
    this.state = {
      loggedIn: Auth.authResponse.authenticated
    };
  }

  updateAuth = (authResponse: AuthResponse) => {
    this.setState({
      loggedIn: authResponse.authenticated
    })
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
          <HeaderRow title={<Link to="/">Sourcer</Link>}>
            <Navigation>
              {
                this.state.loggedIn ? <Link to="/edit"><Icon name="edit" /> {resource.write_code}</Link> : null
              }
              {
                this.state.loggedIn ? (<Link to="/logout"><Icon name="open_in_new" /> {resource.logout}</Link>) : (<Link to="login"><Icon name="input" /> {resource.login}</Link>)
              }
              {
                !this.state.loggedIn ? (<Link to="/signup"><Icon name="create" /> {resource.sign_up}</Link>) : null
              }
              <a target="_new" href="/docs.html"><Icon name="help" /> {resource.api_document}</a>
            </Navigation>
          </HeaderRow>
        </Header>
        <Content>
          <Grid>
            <Cell col={1} hideTablet hidePhone />
            <Cell col={10}>
              {this.props.children}
            </Cell>
          </Grid>
        </Content>
        <Footer size="mini">
          <FooterSection type="left">
            <FooterLinkList>
              {/* */}
            </FooterLinkList>
          </FooterSection>
        </Footer>
      </div>
    );
  }
}
