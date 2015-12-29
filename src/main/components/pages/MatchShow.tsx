import * as React from 'react';
import {Link} from 'react-router';

export default class MatchShow extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>MatchShow</h1>
        <li><Link to="userShow" params={{ userId: "userId123" }}>Choose User</Link></li>
        <li><Link to="matchAgainst" params={{ userId: "userId123" }}>Choose Match Against</Link></li>
      </div>
    );
  }
}
