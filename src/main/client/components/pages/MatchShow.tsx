import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';
import { strings } from '../resources/Strings';
import { RouteParams } from '../routes';
import { useMatchDump } from '../hooks/api-hooks';
import Replayer from '../parts/replayer/Replayer';

export default function MatchShow(props: RouteComponentProps<RouteParams>) {
  const gameDump = useMatchDump(props.match.params.matchId);

  const resource = strings();

  if (!gameDump) {
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
        <Replayer gameDump={gameDump} scale={1.2} />
      </div>
    </div>
  );
}
