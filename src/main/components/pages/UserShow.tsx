import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {List, ListItem, ListItemContent, Grid, Cell, Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import Matches from '../parts/Matches';
import Auth from '../../service/Auth';
import User from '../../service/User';
import {RouteParams} from '../routes';

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

  request: RequestPromise<UserResponse>;

  componentDidMount() {
    if (Auth.authenticated) {
      this.request = User.select(this.props.params.account);
      this.request.then((user) => {
        this.setState({
          user: user
        });
      });
    }
  }

  componentWillUnmount() {
    this.request && this.request.abort();
  }

  componentWillUpdate(nextProps: UserShowProps, nextState: UserShowStats) {
    if (Auth.authenticated && nextProps.params.account !== this.props.params.account) {
      this.request && this.request.abort();
      this.request = User.select(nextProps.params.account);
      this.setState({ user: null });
      this.request.then((user) => {
        this.setState({
          user: user
        });
      });
    }
  }

  render() {
    let resource = strings();

    let account = this.props.params.account;
    let user = this.state.user;

    if (!user) {
      return (<p>Loading...</p>);
    }

    let members = user.members.map((member, index) => {
      return (<ListItem key={index}>
        <ListItemContent icon="person">{member}</ListItemContent>
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
              <Link to={`/match/new/${user.account}`}><Button ripple>{resource.fight}</Button></Link>
            </CardActions>
          </Card>
        </Cell>
        <Cell col={8}>
          <Matches matches={user.matches} />
        </Cell>
      </Grid>
    );
  }
}
