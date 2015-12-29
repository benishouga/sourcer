import * as React from 'react';
import {Link} from 'react-router';

export default class MatchNew extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>MatchNew</h1>
        <li><Link to="matchShow" params={{ matchId: "matchId123" }}>Start Match</Link></li>
        <li><Link to="matchAgainst" params={{ userId: "userId123" }}>Choose Match Against</Link></li>
      </div>
    );
  }
}
