import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {Grid, Cell, Card, CardTitle} from 'react-mdl';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import {GameDump} from '../../core/Dump';
import {RouteParams} from '../routes';
import Replayer from '../parts/Replayer';
import Match from '../../service/Match';

interface MatchShowProps extends RouteComponentProps<RouteParams, {}> {
}

interface MatchShowState {
  gameDump?: GameDump;
}

export default class MatchShow extends React.Component<MatchShowProps, MatchShowState> {
  constructor() {
    super();
    this.state = {};
  }

  requests: RequestPromise<any>[] = [];
  componentDidMount() {
    {
      let request = Match.replay(this.props.params.matchId);;
      request.then((gameDump) => {
        this.setState({
          gameDump: gameDump
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
    let matchId = this.props.params.matchId;

    if (!this.state.gameDump) {
      return (<p>{resources.loading}</p>);
    }

    return (
      <Grid>
        <Cell col={2} hidePhone hideTablet />
        <Cell col={8} phone={12} tablet={12}>
          <Replayer gameDump={this.state.gameDump} scale={1.2} />
        </Cell>
      </Grid>
    );
  }
}
