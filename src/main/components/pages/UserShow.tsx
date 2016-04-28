import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {RouteParams} from '../routes';
import Matches from '../parts/Matches';
import Auth from '../../service/Auth';
import User from '../../service/User';
import {List, ListItem, ListItemContent, Grid, Cell, Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';

interface UserShowProps extends RouteComponentProps<RouteParams, {}> {
  user?: UserResponse;
}

interface UserShowStats {
  user?: UserResponse;
}

export default class UserShow extends React.Component<UserShowProps, UserShowStats> {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (Auth.authenticated) {
      User.select(this.props.params.account).then((user) => {
        this.setState({
          user: user
        });
      });
    }
  }

  render() {
    let account = this.props.params.account;
    let user = this.state.user;

    if (!user) {
      return (<p>Loading...</p>);
    }

    let members = user.members.map((m, index) => {
      return (<ListItem key={index}>
        <ListItemContent icon="person">{m}</ListItemContent>
      </ListItem>)
    });


    return (
      <Grid>
        <Cell col={4}>
          <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
            <CardTitle expand style={{ alignItems: 'flex-start' }}>
              {user.name}
            </CardTitle>
            <CardText>
              <List>
                {members}
              </List>
            </CardText>
            <CardActions border style={{ borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center' }}>
              <Link to={`/match/new/${user.account}`}><Button ripple>Fight</Button></Link>
            </CardActions>
          </Card>
        </Cell>
        <Cell col={8}>
          <Matches account={account} />
        </Cell>
      </Grid>
    );
  }
}
