import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {RouteParams} from '../routes';
import Replayer from '../parts/Replayer';
import Match from '../../service/Match';
import {GameDump} from '../../core/Dump';
import {Grid, Cell, Card, CardTitle} from 'react-mdl';

interface MatchShowProps extends RouteComponentProps<RouteParams, {}> {
}

interface MatchShowState {
  gameDump?: GameDump;
  contestants?: { name: string }[];
}

export default class MatchShow extends React.Component<MatchShowProps, MatchShowState> {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    Match.select(this.props.params.matchId).then((gameDump: GameDump) => {
      this.setState({
        gameDump: gameDump,
        contestants: gameDump.frames[0].sourcers.map((sourcer) => {
          return { name: sourcer.name };
        })
      });
    });
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
                  <Link to={`/match/new/${this.state.contestants[0].name}`}>{this.state.contestants[0].name}</Link>
                </CardTitle>
              </Card>
            </Cell>
            <Cell col={6} table={8}>
              <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
                <CardTitle expand style={{ alignItems: 'flex-start' }}>
                  <Link to={`/match/new/${this.state.contestants[1].name}`}>{this.state.contestants[1].name}</Link>
                </CardTitle>
              </Card>
            </Cell>
          </Grid>
        </Cell>
      </Grid>
    );
  }
}
