import * as React from 'react';
import {Link} from 'react-router';
import Auth from '../../service/Auth';

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

  updateAuth(loggedIn: boolean) {
    this.setState({
      loggedIn: loggedIn
    })
  }

  componentWillMount() {
    Auth.addOnChangeListener((loggedIn: boolean) => {
      this.updateAuth(loggedIn);
    })
    Auth.login().then((loggedIn: boolean) => {
      this.updateAuth(loggedIn);
    });
  }

  render() {
    return (
      <div className="scr-layout mdl-layout mdl-layout--fixed-header mdl-color--white-100 is-upgraded">
        <header className="scr-header mdl-layout__header mdl-layout__header--scroll mdl-color--grey-100 mdl-color-text--grey-800">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title"><Link to="/">Sourcer</Link></span>
            <nav className="mdl-navigation">
              {
                this.state.loggedIn ? <Link className="mdl-navigation__link mdl-color-text--grey-800" to="edit">WRITE CODE</Link> : null
              }
            </nav>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation">
              {
                this.state.loggedIn ? (<Link className="mdl-navigation__link mdl-color-text--grey-800" to="logout">Logout</Link>) :
                  (<Link className="mdl-navigation__link mdl-color-text--grey-800" to="login">Login</Link>)
              }
              {
                !this.state.loggedIn ? (<Link className="mdl-navigation__link mdl-color-text--grey-800" to="signup">SignUp</Link>) : null
              }

            </nav>
          </div>
        </header>
        <main className="scr-main mdl-layout__content">
          <div className="scr-container mdl-grid">
            <div className="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
            <div className="scr-content content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col">
              {this.props.children}
            </div>
          </div>
        </main>
        <footer className="scr-footer mdl-mini-footer">
          <div className="mdl-mini-footer--left-section">
            <ul className="mdl-mini-footer--link-list">
              <li><a href="#">HOGEEEEEEE</a></li>
              <li><a href="#">HOGEEEEEEE</a></li>
              <li><a href="#">HOGEEEEEEE</a></li>
            </ul>
          </div>
        </footer>
      </div>
    );
  }
}
