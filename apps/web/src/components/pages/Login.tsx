import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Card, CardTitle, CardText, CardActions, Button, Textfield, Icon, Spacer } from 'react-mdl';

import { strings } from '../resources/Strings';

import Auth from '../../service/Auth';
import ComponentExplorer from '../../utils/ComponentExplorer';

export interface LoginState {
  error?: boolean;
  redirectToReferrer: boolean;
  admin: boolean;
}

export default class Login extends React.Component<RouteComponentProps<{}>, LoginState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.state = { error: false, redirectToReferrer: false, admin: false };
  }

  private accountRef = React.createRef<Textfield>();
  private passwordRef = React.createRef<Textfield>();

  private async handleSubmit(event: React.FormEvent<{}>) {
    event.preventDefault();

    const account = ComponentExplorer.extractInputValue(this.accountRef.current);
    const password = ComponentExplorer.extractInputValue(this.passwordRef.current);

    const loggedIn = await Auth.login({ account, password });

    if (!loggedIn.authenticated) {
      return this.setState({ error: true });
    }
    this.setState({ redirectToReferrer: true, admin: loggedIn.admin });
  }

  public render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer, admin } = this.state;
    if (redirectToReferrer) {
      return <Redirect to={admin ? '/official' : from} />;
    }

    const resource = strings();
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <Card shadow={0} style={{ margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            {resource.loginTitle}
          </CardTitle>
          <CardText>
            <Textfield label={resource.fieldLabelAccount} floatingLabel ref={this.accountRef} />
            <Textfield label={resource.fieldLabelPassword} floatingLabel ref={this.passwordRef} type="password" />
            {this.state.error && <p>{resource.badRequest}</p>}
          </CardText>
          <CardActions
            border
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              boxSizing: 'border-box',
              alignItems: 'center'
            }}
          >
            <Button raised colored ripple onClick={this.handleSubmit.bind(this)}>
              {resource.login}
            </Button>
            <Spacer />
            <Icon name="account_box" />
          </CardActions>
        </Card>
      </form>
    );
  }
}
