import * as React from 'react';
import {Link} from 'react-router';

export default class UserShow extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>UserShow</h1>
        <ul>
          <li><Link to="userShow" params={{ userId: "userId123" }}>Choose Other User</Link></li>
          <li><Link to="matchShow" params={{ matchId: "matchId123" }}>Choose Match</Link></li>
          <li><Link to="matchAgainst" params={{ userId: "userId123" }}>Choose Match Against</Link></li>
        </ul>
      </div>
    );
  }
}
