import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Grid, Cell, Button, Dialog, DialogTitle, DialogContent, ProgressBar } from 'react-mdl';

import { strings } from '../resources/Strings';

import { RequestPromise } from '../../utils/fetch';
import User from '../../service/User';
import Match from '../../service/Match';
import { RouteParams } from '../routes';
import ProfileCard from '../parts/ProfileCard';

interface MatchNewStats {
  user?: UserResponse;
  against?: UserResponse;
  openDialog?: boolean;
}

export default class MatchNew extends React.Component<RouteComponentProps<RouteParams>, MatchNewStats> {
  constructor() {
    super();
    this.state = {};
  }

  public handleOpenDialog() {
    this.setState({
      openDialog: true
    });
    Match.create(this.props.match.params.account).then((match: MatchResponse) => {
      const context = this.context as any;
      context.router.replace(`/match/${match._id}`);
    });
  }

  private requests: RequestPromise<UserResponse>[] = [];
  public componentDidMount() {
    {
      const request = User.select();
      request.then((user) => {
        this.setState({ user });
      });
      this.requests.push(request);
    }
    {
      const request = User.select(this.props.match.params.account);
      request.then((user) => {
        this.setState({
          against: user
        });
      });
      this.requests.push(request);
    }
  }

  public componentWillUnmount() {
    this.requests.forEach(request => request.abort());
  }

  public render() {
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
