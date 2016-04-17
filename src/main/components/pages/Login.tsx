import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import Auth from '../../service/Auth';
import {List, ListItem, ListItemContent, Card, CardTitle, CardText, CardActions, Button, Textfield, Icon, Spacer} from 'react-mdl';

interface LoginProps extends RouteComponentProps<{}, {}> {
}

interface LoginStats {
  error?: boolean;
}

export default class Login extends React.Component<LoginProps, LoginStats> {
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object
  };

  userId: string;
  password: string;

  constructor() {
    super();
    this.state = { error: false };
  }

  onChangeUserId(userId: any) {
    this.userId = userId.target.value;
  }

  onChangePassword(password: any) {
    this.password = password.target.value;
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    Auth.login(this.userId, this.password).then((loggedIn) => {
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
      <form onSubmit={this.handleSubmit.bind(this) }>
        <Card shadow={0} style={{ margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            Login
          </CardTitle>
          <CardText>
            <Textfield label="User Id..." floatingLabel onChange={this.onChangeUserId.bind(this) } />
            <Textfield label="Password..." floatingLabel onChange={this.onChangePassword.bind(this) } />
            {this.state.error && (
              <p>Bad login information</p>
            ) }
          </CardText>
          <CardActions border style={{ borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center' }}>
            <Button raised colored ripple onClick={this.handleSubmit.bind(this) }>Login</Button>
            <Spacer />
            <Icon name="account_box" />
          </CardActions>
        </Card>
      </form>
    );
  }
}
