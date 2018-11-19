import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Card, CardTitle, CardText, CardActions, Button, Textfield, Icon, Spacer } from 'react-mdl';

import { strings } from '../resources/Strings';

import Auth from '../../service/Auth';
import ComponentExplorer from '../../utils/ComponentExplorer';

export default function Login(props: RouteComponentProps<{}>) {
  const [error, setError] = React.useState<boolean>(false);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState<boolean>(false);
  const [admin, setAdmin] = React.useState<boolean>(false);

  const accountRef = React.useRef<Textfield>(null);
  const passwordRef = React.useRef<Textfield>(null);

  const { from } = props.location.state || { from: { pathname: '/' } };

  async function handleSubmit(event: React.FormEvent<{}>) {
    event.preventDefault();
    const account = ComponentExplorer.extractInputValue(accountRef.current);
    const password = ComponentExplorer.extractInputValue(passwordRef.current);

    const loggedIn = await Auth.login({ account, password });

    if (!loggedIn.authenticated) {
      return setError(true);
    }
    setAdmin(loggedIn.admin);
    setRedirectToReferrer(true);
  }

  if (redirectToReferrer) {
    return <Redirect to={admin ? '/official' : from} />;
  }

  const resource = strings();
  return (
    <form onSubmit={handleSubmit}>
      <Card shadow={0} style={{ margin: 'auto' }}>
        <CardTitle expand style={{ alignItems: 'flex-start' }}>
          {resource.loginTitle}
        </CardTitle>
        <CardText>
          <Textfield label={resource.fieldLabelAccount} floatingLabel ref={accountRef} />
          <Textfield label={resource.fieldLabelPassword} floatingLabel ref={passwordRef} type="password" />
          {error && <p>{resource.badRequest}</p>}
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
          <Button raised colored ripple onClick={handleSubmit}>
            {resource.login}
          </Button>
          <Spacer />
          <Icon name="account_box" />
        </CardActions>
      </Card>
    </form>
  );
}
