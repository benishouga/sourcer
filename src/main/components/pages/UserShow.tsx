import * as React from 'react';
import {Link} from 'react-router';

export default class UserShow extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>UserShow</h1>
        <ul>
          <li><Link to={`user/${'userId123'}`}>Choose Other User</Link></li>
          <li><Link to={`match/${'matchId123'}`}>Choose Match</Link></li>
          <li><Link to={`match/new/${'userId123'}`}>Choose Match Against</Link></li>
        </ul>
      </div>
    );
  }
}
