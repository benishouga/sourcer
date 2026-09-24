import * as React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemContent, ListItemAction, Icon, FABButton, Tooltip } from 'react-mdl';
import moment from 'moment';

import { strings } from '../resources/Strings';

import User from '../../service/User';
import { UserResponse } from '../../../dts/UserResponse';

export interface RecentUpdatedUsersProps {
  account?: string;
}

export interface RecentUpdatedUsersState {
  users: UserResponse[] | null;
}

export default class RecentUpdatedUsers extends React.Component<RecentUpdatedUsersProps, RecentUpdatedUsersState> {
  constructor(props: RecentUpdatedUsersProps) {
    super(props);
    this.state = { users: null };
  }

  private abortController: AbortController = new AbortController();

  public async componentDidMount() {
    const signal = this.abortController.signal;
    const users = await User.recent({ signal }).catch(error => console.log(error));
    if (users) {
      this.setState({ users });
    }
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public render() {
    const resource = strings();
    const elements = this.elements();
    return (
      <div>
        <h5>{resource.recentUpdatedUsersTitle}</h5>
        <List>{elements}</List>
      </div>
    );
  }

  private elements() {
    const resource = strings();
    if (this.state.users && this.state.users.length !== 0) {
      return this.state.users.map(user => {
        return (
          <ListItem key={user.account} threeLine>
            <ListItemContent avatar="person" subtitle={this.subtitle(user)}>
              <Link to={`/user/${user.account}`}>{user.name}</Link>
            </ListItemContent>
            <ListItemAction>
              <Tooltip label="Fight" position="right">
                <Link to={`/match/new/${user.account}`}>
                  <FABButton mini ripple colored>
                    <Icon name="whatshot" />
                  </FABButton>
                </Link>
              </Tooltip>
            </ListItemAction>
          </ListItem>
        );
      });
    }
    return <p>{resource.none}</p>;
  }

  private subtitle(user: UserResponse) {
    const resource = strings();
    if (!user.members) {
      return null;
    }
    const members = user.members.join(', ');
    return (
      <div>
        {`${members}`}
        {members.length ? <br /> : null}
        <Icon name="mood" className="inline" /> {user.wins} {resource.wins}
        &ensp;
        <Icon name="sentiment_very_dissatisfied" className="inline" /> {user.losses} {resource.losses}
        &ensp;
        <span className="updated">
          {resource.updatedAt} {moment(user.updated).fromNow()}
        </span>
      </div>
    );
  }
}
