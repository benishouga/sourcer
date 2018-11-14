import * as React from 'react';
import { Link } from 'react-router-dom';

import { Card, CardTitle, CardText, CardActions, Button, List, ListItem, ListItemContent, Icon } from 'react-mdl';
import { strings } from '../resources/Strings';
import { UserResponse } from '../../../dts/UserResponse';
import WinsAndLoses from './WinsAndLoses';

export interface ProfileCardProps {
  user: UserResponse;
  showWriteCode?: boolean;
  showFight?: boolean;
}

export default function ProfileCard(props: ProfileCardProps) {
  const resource = strings();
  const user = props.user;

  if (!user.members) {
    return null;
  }

  return (
    <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
      <CardTitle>{user.name}</CardTitle>
      <CardText>
        <p>
          <WinsAndLoses wins={user.wins} losses={user.losses} />
        </p>
        <List>
          {user.members.map((member, index) => (
            <ListItem key={index}>
              <ListItemContent icon="person">{member}</ListItemContent>
            </ListItem>
          ))}
        </List>
      </CardText>
      <CardActions border>
        {props.showWriteCode ? (
          <Link to="/edit">
            <Button ripple colored raised>
              <Icon name="edit" /> {resource.writeCode}
            </Button>
          </Link>
        ) : null}
        {props.showFight ? (
          <Link to={`/match/new/${user.account}`}>
            <Button ripple colored raised>
              <Icon name="whatshot" /> {resource.fight}
            </Button>
          </Link>
        ) : null}
      </CardActions>
    </Card>
  );
}
