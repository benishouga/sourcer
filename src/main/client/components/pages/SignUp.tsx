import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';

import { strings } from '../resources/Strings';

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

export interface LoginState {
  errors: ResourceId[] | null;
  redirectTo?: string;
}

export default class Login extends React.Component<RouteComponentProps<{}>, LoginState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.state = { errors: null };
  }

  private async handleSubmit(event: React.FormEvent<{}>) {
    event.preventDefault();

    const account = ComponentExplorer.extractInputValue(this.refs.account);
    const password = ComponentExplorer.extractInputValue(this.refs.password);
    const name = ComponentExplorer.extractInputValue(this.refs.name);
    const appKey = ComponentExplorer.extractInputValue(this.refs.appKey);
    const members = [
      ComponentExplorer.extractInputValue(this.refs.member1),
      ComponentExplorer.extractInputValue(this.refs.member2),
      ComponentExplorer.extractInputValue(this.refs.member3),
      ComponentExplorer.extractInputValue(this.refs.member4),
      ComponentExplorer.extractInputValue(this.refs.member5)
    ]
      .map(v => v.trim())
      .filter(v => !!v);

    try {
      await User.create({ parameter: { account, password, name, members, appKey } });
    } catch (error) {
      this.setState({ errors: (error.response.body as ErrorResponse).errors });
      return;
    }
    await Auth.login();
    this.setState({ redirectTo: '/' });
  }

  public render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const resource = strings();

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <Card shadow={0} style={{ width: '400px', margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            {resource.signUpTitle}
          </CardTitle>
          <CardText>
            <Textfield label={resource.fieldLabelAccount} floatingLabel ref="account" />
            <Textfield label={resource.fieldLabelPassword} floatingLabel ref="password" type="password" />
            <Textfield
              label={Config.values.teamGame ? resource.fieldLabelNameForTeamGame : resource.fieldLabelName}
              floatingLabel
              ref="name"
            />
            <div className="headered-list" style={{ display: Config.values.teamGame ? '' : 'none' }}>
              <p>{resource.members}</p>
              <List className="list-text-fields">
                <ListItem>
                  <ListItemContent icon="person">
                    <Textfield label={resource.fieldLabelMember1} floatingLabel ref="member1" />
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person">
                    <Textfield label={resource.fieldLabelMember2} floatingLabel ref="member2" />
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person">
                    <Textfield label={resource.fieldLabelMember3} floatingLabel ref="member3" />
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person">
                    <Textfield label={resource.fieldLabelMember4} floatingLabel ref="member4" />
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person">
                    <Textfield label={resource.fieldLabelMember5} floatingLabel ref="member5" />
                  </ListItemContent>
                </ListItem>
              </List>
            </div>
            <Textfield
              label={resource.fieldLabelAppKey}
              floatingLabel
              ref="appKey"
              style={{ display: Config.values.requireAppKey ? '' : 'none' }}
            />
            {this.state.errors &&
              this.state.errors.map(error => {
                return <p>{resource[error]}</p>;
              })}
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
              {resource.signUp}
            </Button>
            <div className="mdl-layout-spacer" />
            <Icon name="account_box" />
          </CardActions>
        </Card>
      </form>
    );
  }
}
