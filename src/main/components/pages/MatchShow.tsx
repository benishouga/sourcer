import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {Grid, Cell, Card, CardTitle} from 'react-mdl';
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

  request: RequestPromise<GameDump>;

  componentDidMount() {
    this.request = Match.select(this.props.params.matchId);
    this.request.then((gameDump: GameDump) => {
      this.setState({
        gameDump: gameDump
      });
    });
  }

  componentWillUnmount() {
    this.request && this.request.abort();
  }

  render() {
    let matchId = this.props.params.matchId;

    if (!this.state.gameDump) {
      return (<p>Loading...</p>);
    }

    return (
      <Grid>
        <Cell col={2} hidePhone hideTablet />
        <Cell col={8}>
          <Replayer gameDump={this.state.gameDump} scale={1.5} />
          <Grid>
            <Cell col={6} table={8}>
              <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
                <CardTitle expand style={{ alignItems: 'flex-start' }}>
                  <Link to={`/match/new/${this.state.gameDump.members[0].name}`}>{this.state.gameDump.members[0].name}</Link>
                </CardTitle>
              </Card>
            </Cell>
            <Cell col={6} table={8}>
              <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
                <CardTitle expand style={{ alignItems: 'flex-start' }}>
                  <Link to={`/match/new/${this.state.gameDump.members[1].name}`}>{this.state.gameDump.members[1].name}</Link>
                </CardTitle>
              </Card>
            </Cell>
          </Grid>
        </Cell>
      </Grid>
    );
  }
}
