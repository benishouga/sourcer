import * as React from 'react';
import {Link, RouteHandler} from 'react-router';

export default class App extends React.Component<{}, {}> {
  render() {
    return (
      <div className="scr-layout mdl-layout mdl-layout--fixed-header mdl-js-layout mdl-color--white-100 is-upgraded">
        <header className="scr-header mdl-layout__header mdl-layout__header--scroll mdl-color--grey-100 mdl-color-text--grey-800">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title"><Link to="app">Sourcer</Link></span>
            <nav className="mdl-navigation">
              <Link className="mdl-navigation__link mdl-color-text--grey-800" to="edit">WRITE CODE</Link>
            </nav>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation">
              <Link className="mdl-navigation__link mdl-color-text--grey-800" to="signin">Sign in</Link>
            </nav>
          </div>
        </header>
        <main className="scr-main mdl-layout__content">
          <div className="scr-container mdl-grid">
            <div className="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
            <div className="scr-content content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col">
              <RouteHandler {...this.props} />
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
