import React, { useState } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Card, CardTitle, CardText, CardActions, Button, Textfield, Icon, Spacer } from 'react-mdl';

import { strings } from '../resources/Strings';

import Auth from '../../service/Auth';
import ComponentExplorer from '../../utils/ComponentExplorer';

const Login: React.FC<RouteComponentProps<{}>> = (props) => {
  const [error, setError] = useState<boolean>(false);
  const [redirectToReferrer, setRedirectToReferrer] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<{}>) => {
    event.preventDefault();

    const account = ComponentExplorer.extractInputValue(this.refs.account);
    const password = ComponentExplorer.extractInputValue(this.refs.password);

    const loggedIn = await Auth.login({ account, password });

    if (!loggedIn.authenticated) {
      return setError(true);
    }
    setRedirectToReferrer(true);
    setAdmin(loggedIn.admin);
  };

  const { from } = props.location.state || { from: { pathname: '/' } };
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
          <Textfield label={resource.fieldLabelAccount} floatingLabel ref="account" />
          <Textfield label={resource.fieldLabelPassword} floatingLabel ref="password" type="password" />
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
};

export default Login;
