import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import RouterContext from 'react-router/lib/RouterContext';
import Auth from '../../service/Auth';

interface LoginProps extends RouteComponentProps<{}, {}> {
}

interface LoginStats {
  userId?: string;
  password?: string;
  error?: boolean;
}

export default class Login extends React.Component<LoginProps, LoginStats> {
  static contextTypes: React.ValidationMap<any> = {
		router: React.PropTypes.object
	};

  constructor() {
    super();
    this.state = { error: false };
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    let refs = this.refs as any;
    let userIdElement = refs.userId as HTMLInputElement;
    let passwordElement = refs.password as HTMLInputElement;

    const userId = userIdElement.value;
    const password = passwordElement.value;

    Auth.login(userId, password).then((loggedIn) => {
      if (!loggedIn) {
        return this.setState({ error: true });
      }

      const { location } = this.props;
      let state = location.state as any;
      let context = this.context as any;

      if (state && state.nextPathname) {
        context.router.replace(state.nextPathname);
      } else {
        context.router.replace('/');
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label><input ref="userId" placeholder="userId" /></label>
        <label><input ref="password" placeholder="password" /></label>
        <button type="submit">login</button>
        {this.state.error && (
          <p>Bad login information</p>
        ) }
      </form>
    );
  }
}
