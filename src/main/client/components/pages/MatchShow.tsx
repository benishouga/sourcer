import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Grid, Cell } from 'react-mdl';

import { strings } from '../resources/Strings';

import { GameDump } from '../../../core/Dump';
import { RouteParams } from '../routes';
import Replayer from '../parts/Replayer';
import Match from '../../service/Match';

const MatchShow: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [gameDump, setGameDump] = useState<GameDump | undefined>(undefined);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchGameDump = async () => {
      const signal = abortController.signal;
      const matchId = props.match.params.matchId;
      if (!matchId) {
        console.log(`matchId: ${matchId}`);
        return;
      }
      const gameDump = await Match.replay({ signal, matchId }).catch(error => console.log(error));
      if (gameDump) {
        setGameDump(gameDump);
      }
    };

    fetchGameDump();

    return () => {
      abortController.abort();
    };
  }, [props.match.params.matchId]);

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
};

export default MatchShow;
