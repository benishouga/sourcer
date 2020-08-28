import * as React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemContent, ListItemAction, Icon, FABButton, Tooltip } from 'react-mdl';
import moment from 'moment';

import { strings } from '../resources/Strings';
import { useRecentUsers } from '../hooks/api-hooks';
import WinsAndLoses from './WinsAndLoses';

export default function RecentUpdatedUsers() {
  const resource = strings();
  const users = useRecentUsers();

  if (!users) {
    return (
      <>
        <h5>{resource.recentUpdatedUsersTitle}</h5>
        <p>{resource.loading}</p>
      </>
    );
  }

  if (!users.length) {
    return (
      <>
        <h5>{resource.recentUpdatedUsersTitle}</h5>
        <p>{resource.none}</p>
      </>
    );
  }

  return (
    <div>
      <h5>{resource.recentUpdatedUsersTitle}</h5>
      <List>
        {users.map(user => (
          <ListItem key={user.account} threeLine>
            <ListItemContent
              avatar="person"
              subtitle={
                !user.members ? null : (
                  <div>
                    {user.members.join(', ')}
                    {user.members.length ? <br /> : null}
                    <WinsAndLoses wins={user.wins} losses={user.losses} />
                    &ensp;
                    <span className="updated">
                      {resource.updatedAt} {moment(user.updated).fromNow()}
                    </span>
                  </div>
                )
              }
            >
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
        ))}
      </List>
    </div>
  );
}
