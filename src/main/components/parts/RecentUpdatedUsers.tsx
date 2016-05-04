import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router';
import {List, ListItem, ListItemContent, ListItemAction, Icon, FABButton, Tooltip} from 'react-mdl';
import * as moment from 'moment';

import {strings} from '../resources/Strings';

import User from '../../service/User';
import {RequestPromise} from '../../utils/fetch';

interface RecentUpdatedUsersProps extends React.Props<RecentUpdatedUsers> {
  account?: string;
}

interface RecentUpdatedUsersState {
  users?: UserResponse[];
}

export default class RecentUpdatedUsers extends React.Component<RecentUpdatedUsersProps, RecentUpdatedUsersState>{
  constructor() {
    super();
    this.state = { users: null };
  }

  request: RequestPromise<UserResponse[]>;

  componentDidMount() {
    this.request = User.recent();
    this.request.then((users) => {
      this.setState({
        users: users
      });
    });
  }

  componentWillUnmount() {
    this.request && this.request.abort();
  }


  render() {
    let resource = strings();
    let elements = this.elements();
    return (
      <div>
        <p>{resource.recent_updated_users_title}</p>
        <List>
          {elements}
        </List>
      </div>
    );
  }

  elements() {
    if (this.state.users && this.state.users.length !== 0) {
      return this.state.users.map((user) => {
        return (
          <ListItem key={user.account} threeLine >
            <ListItemContent avatar="person" subtitle={this.subtitle(user) }>
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

  subtitle(user: UserResponse) {
    let resource = strings();
    let members = user.members.join(', ');
    return (
      <div>
        {`${members}`}<br />
        <Icon name="mood" className="inline" />{user.wins} {resource.wins} <Icon name="sentiment_very_dissatisfied" className="inline" />{user.losses} {resource.losses} <span className="updated">{resource.updated_at} {moment(user.updated).fromNow() }</span>
      </div>
    );
  }
}
