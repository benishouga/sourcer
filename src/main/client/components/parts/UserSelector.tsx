import * as React from 'react';
import { UserResponse } from '../../../dts/UserResponse';
import { strings } from '../resources/Strings';
import { List, ListItem, ListItemContent, Button, Icon } from 'react-mdl';
import ProfileCard from './ProfileCard';

interface UserSelectorProps {
  users: UserResponse[] | null;
  onSelectUser: (user: UserResponse | null) => void;
}

export default function UserSelector(props: UserSelectorProps) {
  const [selectedUser, setSelectedUser] = React.useState<UserResponse | null>(null);

  function onSelectUser(user: UserResponse | null) {
    setSelectedUser(user);
    props.onSelectUser(user);
  }

  const resource = strings();

  if (!props.users) {
    return <span>{resource.loading}</span>;
  }

  if (selectedUser) {
    return (
      <div>
        <Button raised ripple colored onClick={() => onSelectUser(null)}>
          <Icon name="cancel" /> {resource.reselect}
        </Button>
        <ProfileCard user={selectedUser} />
      </div>
    );
  }

  return (
    <List>
      {props.users.map(user => (
        <ListItem key={user.account}>
          <ListItemContent icon="person">
            <a onClick={() => onSelectUser(user)}>{user.name}</a>
          </ListItemContent>
        </ListItem>
      ))}
    </List>
  );
}
