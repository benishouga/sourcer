import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { strings } from '../resources/Strings';

import User from '../../service/User';
import { Card, CardTitle, CardText, CardActions, Button, Textfield, TextfieldProps, Icon, List, ListItem, ListItemContent } from 'react-mdl';
import ComponentExplorer from '../../utils/ComponentExplorer';

interface LoginStats {
  error?: boolean;
}

export default class Login extends React.Component<RouteComponentProps<{}>, LoginStats> {
  constructor() {
    super();
    this.state = { error: false };
  }

  private handleSubmit(event: React.FormEvent<{}>) {
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
    ].map(v => v.trim()).filter(v => !!v);

    User.create({
      account, password, name, members, appKey
    }).then((succeeded) => {
      if (!succeeded) { return this.setState({ error: true }); }
      const { location } = this.props;
      const state = location.state as any;
      const context = this.context as any;
      if (state && state.nextPathname) {
        context.router.replace(state.nextPathname);
      } else {
        context.router.replace('/');
      }
    }).catch(() => {
      return this.setState({ error: true });
    });
  }

  public render() {
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
            <Textfield label={resource.fieldLabelName} floatingLabel ref="name" />
            <div className="headered-list">
              <p>{resource.members}</p>
              <List className="list-text-fields">
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.fieldLabelMember1} floatingLabel ref="member1" /></ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.fieldLabelMember2} floatingLabel ref="member2" /></ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.fieldLabelMember3} floatingLabel ref="member3" /></ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.fieldLabelMember4} floatingLabel ref="member4" /></ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.fieldLabelMember5} floatingLabel ref="member5" /></ListItemContent>
                </ListItem>
              </List>
            </div>
            <Textfield label={resource.fieldLabelAppKey} floatingLabel ref="appKey" />
            {this.state.error && (
              <p>{resource.badRequest}</p>
            )}
          </CardText>
          <CardActions border style={{ borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center' }}>
            <Button raised colored ripple onClick={this.handleSubmit.bind(this)}>{resource.signUp}</Button>
            <div className="mdl-layout-spacer"></div>
            <Icon name="account_box" />
          </CardActions>
        </Card>
      </form>
    );
  }
}
