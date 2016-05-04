import * as React from 'react';
import {Link} from 'react-router';

import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button, List, ListItem, ListItemContent, Icon} from 'react-mdl';
import {strings} from '../resources/Strings';

import Auth from '../../service/Auth';

interface ProfileCardProps extends React.Props<ProfileCard> {
  user: UserResponse;
  showWriteCode?: boolean;
  showFight?: boolean;
}

interface ProfileCardStats {
}

export default class ProfileCard extends React.Component<ProfileCardProps, ProfileCardStats> {
  render() {
    let resource = strings();
    let user = this.props.user;

    let members = user.members.map((member, index) => {
      return (
        <ListItem key={index}>
          <ListItemContent icon="person">{member}</ListItemContent>
        </ListItem>
      );
    });

    return (
      <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
        <CardTitle expand style={{ alignItems: 'flex-start' }}>
          {user.name}
        </CardTitle>
        <CardText>
          <p><Icon name="mood" className="inline" /> {user.wins} {resource.wins} <Icon name="sentiment_very_dissatisfied" className="inline" /> {user.losses} {resource.losses}</p>
          <List>
            {members}
          </List>
        </CardText>
        <CardActions border>
          {this.props.showWriteCode ? <Link to="/edit"><Button ripple>{resource.write_code}</Button></Link> : null}
          {this.props.showFight ? <Link to={`/match/new/${user.account}`}><Button ripple>{resource.fight}</Button></Link> : null}
        </CardActions>
      </Card>
    );
  }
}
