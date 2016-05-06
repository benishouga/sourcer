import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {Grid, Cell, Button, Dialog, DialogTitle, DialogContent, ProgressBar, List, ListItem, ListItemContent} from 'react-mdl';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import User from '../../service/User';
import Match from '../../service/Match';
import {RouteParams} from '../routes';
import ProfileCard from '../parts/ProfileCard';

interface AdminProps extends RouteComponentProps<RouteParams, {}> {
}

interface AdminStats {
  users?: UserResponse[];
  player1?: UserResponse;
  player2?: UserResponse;
  openDialog?: boolean;
}


export default class Admin extends React.Component<AdminProps, AdminStats> {
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object
  };

  constructor() {
    super();
    this.state = {};
  }

  handleOpenDialog() {
    this.setState({
      openDialog: true
    });
    Match.official(this.state.player1.account, this.state.player2.account).then((match: MatchResponse) => {
      let context = this.context as any;
      context.router.replace(`/match/${match._id}`);
    });
  }

  requests: RequestPromise<UserResponse>[] = [];
  componentDidMount() {
    let request = User.all();
    request.then((users) => {
      this.setState({
        users: users
      });
    });
    this.requests.push(request);
  }

  componentWillUnmount() {
    this.requests.forEach(request => request.abort());
  }

  userList(callback: (user: UserResponse) => void) {
    let resource = strings();
    if (!this.state.users) {
      return (<span>{resource.loading}</span>);
    }
    let lists = this.state.users.map((user) => {
      return (<ListItem key={user.account}><ListItemContent icon="person"><a onClick={() => { callback(user); } }>{user.name}</a></ListItemContent></ListItem>);
    });

    return (
      <List>
        {lists}
      </List>
    );
  }

  render() {
    let resource = strings();

    let player1: React.ReactElement<any>;
    if (this.state.player1) {
      player1 = (<ProfileCard user={this.state.player1} />);
    } else {
      player1 = this.userList((user: UserResponse) => { this.setState({ player1: user }); });
    }

    let player2: React.ReactElement<any>;
    if (this.state.player2) {
      player2 = (<ProfileCard user={this.state.player2} />);
    } else {
      player2 = this.userList((user: UserResponse) => { this.setState({ player2: user }); });
    }

    return (
      <Grid>
        <Cell col={5}>
          {player1}
        </Cell>
        <Cell col={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
          <div style={{ height: '120px' }}></div>
          <Button colored onClick={this.handleOpenDialog.bind(this) } raised ripple>{resource.fight}</Button>
          <Dialog open={this.state.openDialog}>
            <DialogTitle>{resource.fighting}</DialogTitle>
            <DialogContent>
              <ProgressBar indeterminate />
            </DialogContent>
          </Dialog>
        </Cell>
        <Cell col={5}>
          {player2}
        </Cell>
      </Grid>
    );
  }
}
