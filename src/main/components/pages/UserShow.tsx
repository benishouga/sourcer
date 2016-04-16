import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import {RouteParams} from '../routes';
import Matches from '../parts/Matches';

interface UserShowProps extends RouteComponentProps<RouteParams, {}> {
}

export default class UserShow extends React.Component<UserShowProps, {}> {

  fight() {

  }

  render() {
    let userId = this.props.params.userId;
    return (
      <div>
        <h1>{userId}</h1>
        <button onClick={this.fight.bind(this) }>fight</button>
        <ul>
          <li><Link to={`/user/${'userId123'}`}>Choose Other User</Link></li>
          <li><Link to={`/match/${'matchId123'}`}>Choose Match</Link></li>
          <li><Link to={`/match/new/${'userId123'}`}>Choose Match Against</Link></li>
        </ul>
        <Matches userId={userId} />
      </div>
    );
  }
}
