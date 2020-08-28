import * as React from 'react';
import { Redirect } from 'react-router-dom';

import { strings } from '../resources/Strings';
import { ResourceId } from '../../../dts/StringResource';
import { ErrorResponse } from '../../../dts/ErrorResponse';

import User from '../../service/User';
import Config from '../../service/Config';
import {
  Card,
  CardTitle,
  CardText,
  CardActions,
  Button,
  Textfield,
  Icon,
  List,
  ListItem,
  ListItemContent
} from 'react-mdl';
import ComponentExplorer from '../../utils/ComponentExplorer';
import Auth from '../../service/Auth';

export default function SignUp() {
  const [errors, setErrors] = React.useState<ResourceId[] | null>(null);
  const [redirectTo, setRedirectTo] = React.useState<string | null>(null);
  const accountRef = React.useRef<Textfield>(null);
  const passwordRef = React.useRef<Textfield>(null);
  const nameRef = React.useRef<Textfield>(null);
  const appKeyRef = React.useRef<Textfield>(null);
  const memberRefs = [
    React.useRef<Textfield>(null),
    React.useRef<Textfield>(null),
    React.useRef<Textfield>(null),
    React.useRef<Textfield>(null),
    React.useRef<Textfield>(null)
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const account = ComponentExplorer.extractInputValue(accountRef.current);
    const password = ComponentExplorer.extractInputValue(passwordRef.current);
    const name = ComponentExplorer.extractInputValue(nameRef.current);
    const appKey = ComponentExplorer.extractInputValue(appKeyRef.current);
    const members = memberRefs
      .map(memberRef => ComponentExplorer.extractInputValue(memberRef.current).trim())
      .filter(v => !!v);

    try {
      await User.create({ parameter: { account, password, name, members, appKey } });
    } catch (error) {
      setErrors((error.response.body as ErrorResponse).errors);
      return;
    }
    await Auth.login();
    setRedirectTo('/');
  }

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  const resource = strings();

  return (
    <form onSubmit={handleSubmit}>
      <Card shadow={0} style={{ width: '400px', margin: 'auto' }}>
        <CardTitle expand style={{ alignItems: 'flex-start' }}>
          {resource.signUpTitle}
        </CardTitle>
        <CardText>
          <Textfield id={`account`} label={resource.fieldLabelAccount} floatingLabel ref={accountRef} />
          <Textfield
            id={`password`}
            label={resource.fieldLabelPassword}
            floatingLabel
            ref={passwordRef}
            type="password"
          />
          <Textfield
            id={`name`}
            label={Config.values.teamGame ? resource.fieldLabelNameForTeamGame : resource.fieldLabelName}
            floatingLabel
            ref={nameRef}
          />
          <div className="headered-list" style={{ display: Config.values.teamGame ? '' : 'none' }}>
            <p>{resource.members}</p>
            <List className="list-text-fields">
              {memberRefs.map((memberRef, index) => (
                <ListItem key={index}>
                  <ListItemContent icon="person">
                    <Textfield
                      id={`Textfield${index}`}
                      label={resource.fieldLabelMember[index]}
                      floatingLabel
                      ref={memberRef}
                    />
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          </div>
          <Textfield
            label={resource.fieldLabelAppKey}
            floatingLabel
            ref={appKeyRef}
            style={{ display: Config.values.requireAppKey ? '' : 'none' }}
          />
          {errors && errors.map((error, index) => <p key={index}>{resource[error]}</p>)}
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
            {resource.signUp}
          </Button>
          <div className="mdl-layout-spacer" />
          <Icon name="account_box" />
        </CardActions>
      </Card>
    </form>
  );
}
