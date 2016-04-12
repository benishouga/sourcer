import * as React from 'react';
import {Link} from 'react-router';

export default class MatchNew extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>MatchNew</h1>
        <ul>
          <li><Link to={`/match/${'matchId123'}`}>Start Match</Link></li>
          <li><Link to={`/match/new/${'userId123'}`}>Choose Match Against</Link></li>
        </ul>
      </div>
    );
  }
}
