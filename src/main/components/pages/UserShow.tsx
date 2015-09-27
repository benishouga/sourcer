import * as React from 'react';
import {Link} from 'react-router';

export default class UserShow extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>UserShow</h1>
        <ul>
          <li><Link to="userEdit">Edit Profile</Link></li>
          <li><Link to="userShow" params={{ userId: "userId123" }}>Choose User</Link></li>
          <li><Link to="aiShow" params={{ userId: "userId123", aiId: "aiId123" }}>Choose Ai</Link></li>
          <li><Link to="matchShow" params={{ matchId: "matchId123" }}>Choose Match</Link></li>
        </ul>
      </div>
    );
  }
}
