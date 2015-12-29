import * as React from 'react';
import {Link, RouteHandler} from 'react-router';

interface TopProps {
  isSignIn?: boolean;
}

interface TopStats {
}


export default class Top extends React.Component<TopProps, TopStats> {
  render() {
    var isSignIn = this.props.isSignIn || false;
    isSignIn = true;

    if (!isSignIn) {
      return (
        <div className="scr-jumbotron">
          <h2>Sourcer</h2>
          <p>JavaScript で AI をコーディングして対戦させよう！<br />
            ライバルと競い合うことで、あなたの JavaScript コーディングスキルも上達するかも！</p>
        </div>
      );
    }

    return (
      <div>
        <h1>Top</h1>
        <ul>
          <li><Link to="edit">Edit</Link></li>
          <li><Link to="userShow" params={{ userId: "userId123" }}>Choose User</Link></li>
          <li><Link to="matchShow" params={{ matchId: "matchId123" }}>Choose Match</Link></li>
          <li><Link to="matchNew">Choose Match New</Link></li>
          <li><Link to="matchAgainst" params={{ userId: "userId123" }}>Choose Match Against</Link></li>
        </ul>
      </div>
    );
  }
}
