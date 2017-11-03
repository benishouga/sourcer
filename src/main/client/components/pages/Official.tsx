import * as React from 'react';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Dialog, DialogTitle, DialogContent, ProgressBar, List, ListItem, ListItemContent, Icon } from 'react-mdl';

import { strings } from '../resources/Strings';

import { AbortController } from '../../utils/fetch';
import User from '../../service/User';
import Match from '../../service/Match';
import { RouteParams } from '../routes';
import ProfileCard from '../parts/ProfileCard';

interface OfficialStats {
  users?: UserResponse[];
  player1?: UserResponse;
  player2?: UserResponse;
  openDialog?: boolean;
  redirectTo?: string;
}

export default class Official extends React.Component<RouteComponentProps<RouteParams>, OfficialStats> {
  constructor() {
    super();
    this.state = {};
  }

  private async  handleOpenDialog() {
    this.setState({
      openDialog: true
    });
    if (!this.state.player1 || !this.state.player2) {
      throw new Error('player not selected');
    }
    if (!this.state.player1.account || !this.state.player2.account) {
      throw new Error('player account unknown');
    }
    const player1 = this.state.player1.account;
    const player2 = this.state.player2.account;
    const match = await Match.official({ player1, player2 });
    this.setState({ redirectTo: `/match/${match._id}` });
  }

  private abortController: AbortController;
  public async componentDidMount() {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    const users = await User.all({ signal });
    this.setState({ users });
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public userList(callback: (user: UserResponse) => void) {
    const resource = strings();
    if (!this.state.users) {
      return (<span>{resource.loading}</span>);
    }
    const lists = this.state.users.map((user) => {
      return (<ListItem key={user.account}><ListItemContent icon="person"><a onClick={() => { callback(user); }}>{user.name}</a></ListItemContent></ListItem>);
    });

    return (
      <List>
        {lists}
      </List>
    );
  }

  public render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const resource = strings();

    let player1: React.ReactElement<any>;
    if (this.state.player1) {
      player1 = (
        <div>
          <Button raised ripple colored onClick={() => { this.setState({ player1: undefined }); }}>
            <Icon name="cancel" /> {resource.reselect}
          </Button>
          <ProfileCard user={this.state.player1} />
        </div>
      );
    } else {
      player1 = this.userList((user: UserResponse) => { this.setState({ player1: user }); });
    }

    let player2: React.ReactElement<any>;
    if (this.state.player2) {
      player2 = (
        <div>
          <Button raised ripple colored onClick={() => { this.setState({ player2: undefined }); }}>
            <Icon name="cancel" /> {resource.reselect}
          </Button>
          <ProfileCard user={this.state.player2} />
        </div>
      );
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
          <Button colored onClick={this.handleOpenDialog.bind(this)}
            raised ripple disabled={!this.state.player1 || !this.state.player2}>{resource.fight}</Button>
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
