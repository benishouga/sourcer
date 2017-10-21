import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Grid, Cell, Card, CardTitle } from 'react-mdl';

import { strings } from '../resources/Strings';

import { RequestPromise } from '../../utils/fetch';
import { GameDump } from '../../../core/Dump';
import { RouteParams } from '../routes';
import Replayer from '../parts/Replayer';
import Match from '../../service/Match';

interface MatchShowState {
  gameDump?: GameDump;
}

export default class MatchShow extends React.Component<RouteComponentProps<RouteParams>, MatchShowState> {
  constructor() {
    super();
    this.state = {};
  }

  private requests: RequestPromise<any>[] = [];
  public componentDidMount() {
    const request = Match.replay(this.props.match.params.matchId);
    request.then((gameDump) => {
      this.setState({ gameDump });
    });
    this.requests.push(request);
  }

  public componentWillUnmount() {
    this.requests.forEach(request => request.abort());
  }

  public render() {
    const resources = strings();

    if (!this.state.gameDump) {
      return (<p>{resources.loading}</p>);
    }

    return (
      <div className="scr-match-show">
        <Replayer gameDump={this.state.gameDump} scale={1.2} />
      </div>
    );
  }
}
