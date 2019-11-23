import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';

import { GameDump } from '../../../core/Dump';
import { RouteParams } from '../routes';
import Replayer from '../parts/Replayer';
import Match from '../../service/Match';

export interface MatchShowState {
  gameDump?: GameDump;
}

export default class MatchShow extends React.Component<RouteComponentProps<RouteParams>, MatchShowState> {
  constructor(props: RouteComponentProps<RouteParams>) {
    super(props);
    this.state = {};
  }

  private abortController: AbortController = new AbortController();
  public async componentDidMount() {
    const signal = this.abortController.signal;
    const matchId = this.props.match.params.matchId;
    if (!matchId) {
      console.log(`matchId: ${matchId}`);
      return;
    }
    const gameDump = await Match.replay({ signal, matchId }).catch(error => console.log(error));
    if (gameDump) {
      this.setState({ gameDump });
    }
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public render() {
    const resource = strings();

    if (!this.state.gameDump) {
      return (
        <Grid>
          <Cell col={12}>{resource.loading}</Cell>
        </Grid>
      );
    }

    return (
      <div>
        <Grid>
          <Cell col={12}>
            <Link to="/">{resource.returnTop}</Link>
          </Cell>
        </Grid>

        <div className="scr-match-show">
          <Replayer gameDump={this.state.gameDump} scale={1.2} />
        </div>
      </div>
    );
  }
}
