import * as React from 'react';
import {Link} from 'react-router';

export default class MatchShow extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>MatchShow</h1>
        <ul>
          <li><Link to={`/user/${'userId123'}`}>Choose User</Link></li>
          <li><Link to={`/match/new/${'userId123'}`}>Choose Match Against</Link></li>
        </ul>
      </div>
    );
  }
}
