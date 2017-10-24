import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { List, ListItem, ListItemContent, Card, CardTitle, CardText, CardActions, Button, Textfield, Icon, Spacer } from 'react-mdl';

import { strings } from '../resources/Strings';

import Auth from '../../service/Auth';
import ComponentExplorer from '../../utils/ComponentExplorer';

interface LoginStats {
  error?: boolean;
}

export default class Login extends React.Component<RouteComponentProps<{}>, LoginStats> {
  // public static contextTypes: React.ValidationMap<any> = {
  //   router: React.PropTypes.object
  // };

  constructor() {
    super();
    this.state = { error: false };
  }

  private handleSubmit(event: React.FormEvent<{}>) {
    event.preventDefault();

    const account = ComponentExplorer.extractInputValue(this.refs.account);
    const password = ComponentExplorer.extractInputValue(this.refs.password);

    Auth.login(account, password).then((loggedIn) => {
      if (!loggedIn.authenticated) {
        return this.setState({ error: true });
      }

      const { location } = this.props;
      const state = location.state as any;
      const context = this.context as any;

      if (loggedIn.admin) {
        context.router.replace('/official');
      } else if (state && state.nextPathname) {
        context.router.replace(state.nextPathname);
      } else {
        context.router.replace('/');
      }
    });
  }

  public render() {
    const resource = strings();
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <Card shadow={0} style={{ margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            {resource.loginTitle}
          </CardTitle>
          <CardText>
            <Textfield label={resource.fieldLabelAccount} floatingLabel ref="account" />
            <Textfield label={resource.fieldLabelPassword} floatingLabel ref="password" type="password" />
            {this.state.error && (
              <p>{resource.badRequest}</p>
            )}
          </CardText>
          <CardActions border style={{ borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center' }}>
            <Button raised colored ripple onClick={this.handleSubmit.bind(this)}>{resource.login}</Button>
            <Spacer />
            <Icon name="account_box" />
          </CardActions>
        </Card>
      </form>
    );
  }
}
