import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {Grid, Cell, Button, Card, CardTitle, CardText, Dialog, DialogTitle, DialogContent, ProgressBar} from 'react-mdl';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import AceEditor from '../parts/AceEditor';
import User from '../../service/User';
import Match from '../../service/Match';
import {RouteParams} from '../routes';

interface MatchNewProps extends RouteComponentProps<RouteParams, {}> {
}

interface MatchNewStats {
  user?: UserResponse;
  against?: UserResponse;
  openDialog?: boolean;
}


export default class MatchNew extends React.Component<MatchNewProps, MatchNewStats> {
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
    Match.create(this.props.params.account).then((match: MatchResponse) => {
      let context = this.context as any;
      context.router.replace(`/match/${match._id}`);
    });
  }

  requests: RequestPromise<UserResponse>[] = [];
  componentDidMount() {
    {
      let request = User.select();
      request.then((user) => {
        this.setState({
          user: user
        });
      });
      this.requests.push(request);
    }
    {
      let request = User.select(this.props.params.account);
      request.then((user) => {
        this.setState({
          against: user
        });
      });
      this.requests.push(request);
    }
  }

  componentWillUnmount() {
    this.requests.forEach(request => request.abort());
  }

  render() {
    let resources = strings();

    let userCard: React.ReactElement<any>;
    if (this.state.user) {
      userCard = (
        <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            You
          </CardTitle>
          <CardText>
            <AceEditor code={this.state.user.source} readOnly={true} />
          </CardText>
        </Card>
      );
    } else {
      userCard = (<span>{resources.loading}</span>);
    }

    let againstCard: React.ReactElement<any>;
    if (this.state.against) {
      againstCard = (
        <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            {this.state.against.name}
          </CardTitle>
          <CardText>
            <AceEditor code={this.state.against.source} readOnly={true} />
          </CardText>
        </Card>
      );
    } else {
      againstCard = (<span>{resources.loading}</span>);
    }

    return (
      <Grid>
        <Cell col={5}>
          {userCard}
        </Cell>
        <Cell col={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
          <div style={{ height: '120px' }}></div>
          <Button colored onClick={this.handleOpenDialog.bind(this) } raised ripple>{resources.fight}</Button>
          <Dialog open={this.state.openDialog}>
            <DialogTitle>{resources.fighting}</DialogTitle>
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
