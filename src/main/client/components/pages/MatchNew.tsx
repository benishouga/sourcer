import * as React from 'react';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Dialog, DialogTitle, DialogContent, ProgressBar } from 'react-mdl';

import { strings } from '../resources/Strings';

import { AbortController } from '../../utils/fetch';
import User from '../../service/User';
import Match from '../../service/Match';
import { RouteParams } from '../routes';
import ProfileCard from '../parts/ProfileCard';

interface MatchNewStats {
  user?: UserResponse;
  against?: UserResponse;
  openDialog?: boolean;
  redirectTo?: string;
}

export default class MatchNew extends React.Component<RouteComponentProps<RouteParams>, MatchNewStats> {
  constructor() {
    super();
    this.state = {};
  }

  public async handleOpenDialog() {
    const against = this.props.match.params.account;
    if (!against) {
      console.log(`against: ${against}`);
      return;
    }

    this.setState({
      openDialog: true
    });
    const match = await Match.create({ against });
    this.setState({ redirectTo: `/match/${match._id}` });
  }

  private abortController: AbortController;
  public componentDidMount() {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    // process in parallel...
    (async () => {
      const user = await User.select({ signal });
      this.setState({ user });
    })();

    (async () => {
      const account = this.props.match.params.account;
      const user = await User.select({ signal, account });
      this.setState({ against: user });
    })();
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const resource = strings();

    let userCard: React.ReactElement<any>;
    if (this.state.user) {
      userCard = (<ProfileCard user={this.state.user} />);
    } else {
      userCard = (<span>{resource.loading}</span>);
    }

    let againstCard: React.ReactElement<any>;
    if (this.state.against) {
      againstCard = (<ProfileCard user={this.state.against} />);
    } else {
      againstCard = (<span>{resource.loading}</span>);
    }

    return (
      <Grid>
        <Cell col={5}>
          {userCard}
        </Cell>
        <Cell col={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
          <div style={{ height: '120px' }}></div>
          <Button colored onClick={this.handleOpenDialog.bind(this)} raised ripple>{resource.fight}</Button>
          <Dialog open={this.state.openDialog}>
            <DialogTitle>{resource.fighting}</DialogTitle>
            <DialogContent>
              <ProgressBar indeterminate />
            </DialogContent>
          </Dialog>
        </Cell>
        <Cell col={5}>
          {againstCard}
        </Cell>
      </Grid>
    );
  }
}
