import * as React from 'react';
import { Link } from 'react-router-dom';

import { Card, CardTitle, CardText, CardActions, Button, List, ListItem, ListItemContent, Icon } from 'react-mdl';
import { strings } from '../resources/Strings';

export interface ProfileCardProps {
  user: UserResponse;
  showWriteCode?: boolean;
  showFight?: boolean;
}

export default class ProfileCard extends React.Component<ProfileCardProps, {}> {
  public render() {
    const resource = strings();
    const user = this.props.user;

    if (!user.members) {
      return null;
    }

    const members = user.members.map((member, index) => {
      return (
        <ListItem key={index}>
          <ListItemContent icon="person">{member}</ListItemContent>
        </ListItem>
      );
    });

    return (
      <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
        <CardTitle>{user.name}</CardTitle>
        <CardText>
          <p>
            <Icon name="mood" className="inline" /> {user.wins} {resource.wins}
            &ensp;
            <Icon name="sentiment_very_dissatisfied" className="inline" /> {user.losses} {resource.losses}
          </p>
          <List>{members}</List>
        </CardText>
        <CardActions border>
          {this.props.showWriteCode ? (
            <Link to="/edit">
              <Button ripple colored raised>
                <Icon name="edit" /> {resource.writeCode}
              </Button>
            </Link>
          ) : null}
          {this.props.showFight ? (
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
}
