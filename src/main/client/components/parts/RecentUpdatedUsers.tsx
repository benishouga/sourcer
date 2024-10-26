import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemContent, ListItemAction, Icon, FABButton, Tooltip } from 'react-mdl';
import moment from 'moment';

import { strings } from '../resources/Strings';

import User from '../../service/User';
import { UserResponse } from '../../../dts/UserResponse';

export interface RecentUpdatedUsersProps {
  account?: string;
}

const RecentUpdatedUsers: React.FC<RecentUpdatedUsersProps> = (props) => {
  const [users, setUsers] = useState<UserResponse[] | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUsers = async () => {
      const signal = abortController.signal;
      const users = await User.recent({ signal }).catch(error => console.log(error));
      if (users) {
        setUsers(users);
      }
    };

    fetchUsers();

    return () => {
      abortController.abort();
    };
  }, []);

  const resource = strings();
  const elements = elements();

  return (
    <div>
      <h5>{resource.recentUpdatedUsersTitle}</h5>
      <List>{elements}</List>
    </div>
  );

  function elements() {
    const resource = strings();
    if (users && users.length !== 0) {
      return users.map(user => {
        return (
          <ListItem key={user.account} threeLine>
            <ListItemContent avatar="person" subtitle={subtitle(user)}>
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

  function subtitle(user: UserResponse) {
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
};

export default RecentUpdatedUsers;
