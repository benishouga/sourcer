import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemContent, ListItemAction, Icon, FABButton, Tooltip } from 'react-mdl';
import * as moment from 'moment';

import { strings } from '../resources/Strings';

import User from '../../service/User';
import { RequestPromise } from '../../utils/fetch';

interface RecentUpdatedUsersProps extends React.Props<RecentUpdatedUsers> {
  account?: string;
}

interface RecentUpdatedUsersState {
  users: UserResponse[] | null;
}

export default class RecentUpdatedUsers extends React.Component<RecentUpdatedUsersProps, RecentUpdatedUsersState> {
  constructor() {
    super();
    this.state = { users: null };
  }

  private request: RequestPromise<UserResponse[]>;

  public componentDidMount() {
    this.request = User.recent();
    this.request.then((users) => {
      this.setState({
        users
      });
    });
  }

  public componentWillUnmount() {
    if (this.request) {
      this.request.abort();
    }
  }

  public render() {
    const resource = strings();
    const elements = this.elements();
    return (
      <div>
        <p>{resource.recentUpdatedUsersTitle}</p>
        <List>
          {elements}
        </List>
      </div>
    );
  }

  private elements() {
    if (this.state.users && this.state.users.length !== 0) {
      return this.state.users.map((user) => {
        return (
          <ListItem key={user.account} threeLine >
            <ListItemContent avatar="person" subtitle={this.subtitle(user)}>
              <Link to={`/user/${user.account}`}>{user.name}</Link>
            </ListItemContent>
            <ListItemAction>
              <Tooltip label="Fight" position="right">
                <Link to={`/match/new/${user.account}`}><FABButton mini ripple colored ><Icon name="whatshot" /></FABButton></Link>
              </Tooltip>
            </ListItemAction>
          </ListItem>
        );
      });
    }
    return [];
  }

  private subtitle(user: UserResponse) {
    const resource = strings();
    if (!user.members) {
      return null;
    }
    const members = user.members.join(', ');
    return (
      <div>
        {`${members}`}<br />
        <Icon name="mood" className="inline" />
        {user.wins}
        {resource.wins}
        <Icon name="sentiment_very_dissatisfied" className="inline" />
        {user.losses}
        {resource.losses}
        <span className="updated">{resource.updatedAt} {moment(user.updated).fromNow()}</span>
      </div>
    );
  }
}
