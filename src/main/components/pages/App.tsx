import * as React from 'react';
import {Link} from 'react-router';
import Auth from '../../service/Auth';
import {Header, HeaderRow, Navigation, Spacer, Content, Grid, Cell, Footer, FooterSection, FooterLinkList} from 'react-mdl';

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
      loggedIn: Auth.authenticated
    };
  }

  updateAuth = (loggedIn: boolean) => {
    this.setState({
      loggedIn: loggedIn
    })
  };

  componentWillMount() {
    Auth.addOnChangeListener(this.updateAuth);

    Auth.login().then((loggedIn: boolean) => {
      this.updateAuth(loggedIn);
    });
  }

  componentWillUnmount() {
    Auth.removeOnChangeListener(this.updateAuth);
  }

  render() {
    return (
      <div className="mdl-layout mdl-layout--fixed-header mdl-color--white-100 is-upgraded">
        <Header className="scr-header mdl-color--grey-100 mdl-color-text--grey-800" scroll>
          <HeaderRow title={<Link to="/">Sourcer</Link>}>
            <Navigation>
              {
                this.state.loggedIn ? <Link className="mdl-color-text--grey-800" to="/edit">Write Code</Link> : null
              }
              {
                this.state.loggedIn ? (<Link className="mdl-color-text--grey-800" to="/logout">Logout</Link>) :
                  (<Link className="mdl-color-text--grey-800" to="login">Login</Link>)
              }
              {
                !this.state.loggedIn ? (<Link className="mdl-color-text--grey-800" to="/signup">Sign Up</Link>) : null
              }
            </Navigation>
          </HeaderRow>
        </Header>
        <Content>
          <Grid>
            <Cell col={1} className="mdl-cell--hide-tablet mdl-cell--hide-phone" />
            <Cell col={10}>
              {this.props.children}
            </Cell>
          </Grid>
        </Content>
        <Footer size="mini">
          <FooterSection type="left">
            <FooterLinkList>
              <a href="#">HOGEEEEEEE</a>
              <a href="#">HOGEEEEEEE</a>
              <a href="#">HOGEEEEEEE</a>
            </FooterLinkList>
          </FooterSection>
        </Footer>
      </div>
    );
  }
}
