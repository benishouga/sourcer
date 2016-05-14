import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import RouterContext from 'react-router/lib/RouterContext';

import {strings} from '../resources/Strings';

import User from '../../service/User';
import {Card, CardTitle, CardText, CardActions, Button, Textfield, TextfieldProps, Icon, List, ListItem, ListItemContent} from 'react-mdl';
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
    let name = ComponentExplorer.extractInputValue(this.refs['name']);
    let appKey = ComponentExplorer.extractInputValue(this.refs['appKey']);
    let members = [
      ComponentExplorer.extractInputValue(this.refs['member1']),
      ComponentExplorer.extractInputValue(this.refs['member2']),
      ComponentExplorer.extractInputValue(this.refs['member3']),
      ComponentExplorer.extractInputValue(this.refs['member4']),
      ComponentExplorer.extractInputValue(this.refs['member5'])
    ].map(v => v.trim()).filter(v => !!v);

    User.create({
      account: account,
      password: password,
      name: name,
      members: members,
      appKey: appKey
    }).then((succeeded) => {
      if (!succeeded) { return this.setState({ error: true }); }
      const { location } = this.props;
      let state = location.state as any;
      let context = this.context as any;
      if (state && state.nextPathname) {
        context.router.replace(state.nextPathname);
      } else {
        context.router.replace('/');
      }
    }).catch(() => {
      return this.setState({ error: true });
    });
  }

  render() {
    let resource = strings();

    return (
      <form onSubmit={this.handleSubmit.bind(this) }>
        <Card shadow={0} style={{ width: '400px', margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            {resource.sign_up_title}
          </CardTitle>
          <CardText>
            <Textfield label={resource.field_label_account} floatingLabel ref="account" />
            <Textfield label={resource.field_label_password} floatingLabel ref="password" type="password" />
            <Textfield label={resource.field_label_name} floatingLabel ref="name" />
            <div className="headered-list">
              <p>{resource.members}</p>
              <List className="list-text-fields">
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.field_label_member1} floatingLabel ref="member1" /></ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.field_label_member2} floatingLabel ref="member2" /></ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.field_label_member3} floatingLabel ref="member3" /></ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.field_label_member4} floatingLabel ref="member4" /></ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent icon="person"><Textfield label={resource.field_label_member5} floatingLabel ref="member5" /></ListItemContent>
                </ListItem>
              </List>
            </div>
            <Textfield label={resource.field_label_app_key} floatingLabel ref="appKey" />
            {this.state.error && (
              <p>{resource.bad_request}</p>
            ) }
          </CardText>
          <CardActions border style={{ borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center' }}>
            <Button raised colored ripple onClick={this.handleSubmit.bind(this) }>{resource.sign_up}</Button>
            <div className="mdl-layout-spacer"></div>
            <Icon name="account_box" />
          </CardActions>
        </Card>
      </form>
    );
  }
}
