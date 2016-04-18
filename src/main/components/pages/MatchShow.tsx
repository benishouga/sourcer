import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {RouteParams} from '../routes';
import Replayer from '../parts/Replayer';

interface MatchShowProps extends RouteComponentProps<RouteParams, {}> {
}

export default class MatchShow extends React.Component<MatchShowProps, {}> {
  render() {
    let matchId = this.props.params.matchId;
    return (
      <div>
        <h1>MatchShow {matchId}</h1>
        <ul>
          <li><Link to={`/user/${'userId123'}`}>Choose User</Link></li>
          <li><Link to={`/match/new/${'userId123'}`}>Choose Match Against</Link></li>
        </ul>
        <Replayer matchId={matchId} />
      </div>
    );
  }
}
