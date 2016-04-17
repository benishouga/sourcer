import * as React from 'react';
import {Link} from 'react-router';
import Auth from '../../service/Auth';
import User from '../../service/User';
import Matches from '../parts/Matches';
import RecentUpdatedUsers from '../parts/RecentUpdatedUsers';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';

interface TopProps extends React.Props<Top> {
}

interface TopStats {
  userId?: string;
}

export default class Top extends React.Component<TopProps, TopStats> {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (Auth.authenticated) {
      User.select().then((user) => {
        this.setState({
          userId: user.account
        });
      });
    }
  }

  render() {
    if (!Auth.authenticated) {
      return (
        <div className="scr-jumbotron">
          <h2>Sourcer</h2>
          <p>JavaScript で AI をコーディングして対戦させよう！<br />
            ライバルと競い合うことで、あなたの JavaScript コーディングスキルも上達するかも！</p>
        </div>
      );
    }

    return (
      <Grid>
        <Cell col={4}>
          <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
            <CardTitle expand style={{ alignItems: 'flex-start' }}>
              {this.state.userId}
            </CardTitle>
            <CardText>
              card text...
            </CardText>
            <CardActions border style={{ borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center' }}>
              <Link to="/edit"><Button ripple>Write Code</Button></Link>
            </CardActions>
          </Card>
        </Cell>
        <Cell col={8}>
          <Matches />
          <RecentUpdatedUsers />
        </Cell>
      </Grid>
    );
  }
}
