import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router';
import User, {UserModel} from '../../service/User';

interface RecentUpdatedUsersProps extends React.Props<RecentUpdatedUsers> {
  userId?: string;
}

interface RecentUpdatedUsersState {
  users?: UserModel[];
}

export default class RecentUpdatedUsers extends React.Component<RecentUpdatedUsersProps, RecentUpdatedUsersState>{
  constructor() {
    super();
    this.state = { users: null };
  }

  componentDidMount() {
    User.recent().then((users) => {
      this.setState({
        users: users
      })
    });
  }

  render() {
    let elements = this.elements();
    return (
      <div>
        <p>Recent Updated Users</p>
        <ul>
          {elements}
        </ul>
      </div>
    );
  }

  elements() {
    if (this.state.users && this.state.users.length !== 0) {
      return this.state.users.map((user) => {
        return <li key={user.account} ><Link to={`/user/${user.account}`}>{user.account}</Link></li>;
      });
    }
    return [];
  }
}
