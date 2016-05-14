import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {List, ListItem, ListItemContent, Card, CardTitle, CardText, CardActions, Button, Textfield, Icon, Spacer} from 'react-mdl';

import {strings} from '../resources/Strings';

import Auth from '../../service/Auth';
import ComponentExplorer from '../../utils/ComponentExplorer';

interface LoginProps extends RouteComponentProps<{}, {}> {
}

interface LoginStats {
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

    let account = ComponentExplorer.extractInputValue(this.refs['account']);
    let password = ComponentExplorer.extractInputValue(this.refs['password']);

    Auth.login(account, password).then((loggedIn) => {
      if (!loggedIn.authenticated) {
        return this.setState({ error: true });
      }

      const { location } = this.props;
      let state = location.state as any;
      let context = this.context as any;

      if (loggedIn.admin) {
        context.router.replace('/official');
      } else if (state && state.nextPathname) {
        context.router.replace(state.nextPathname);
      } else {
        context.router.replace('/');
      }
    });
  }

  render() {
    let resource = strings();
    return (
      <form onSubmit={this.handleSubmit.bind(this) }>
        <Card shadow={0} style={{ margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            {resource.login_title}
          </CardTitle>
          <CardText>
            <Textfield label={resource.field_label_account} floatingLabel ref="account" />
            <Textfield label={resource.field_label_password} floatingLabel ref="password" type="password" />
            {this.state.error && (
              <p>{resource.bad_request}</p>
            ) }
          </CardText>
          <CardActions border style={{ borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center' }}>
            <Button raised colored ripple onClick={this.handleSubmit.bind(this) }>{resource.login}</Button>
            <Spacer />
            <Icon name="account_box" />
          </CardActions>
        </Card>
      </form>
    );
  }
}
