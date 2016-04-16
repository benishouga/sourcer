import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router';
import User, {UserModel} from '../../service/User';
import {List, ListItem, ListItemContent, ListItemAction, Icon, FABButton} from 'react-mdl';

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
        <List>
          {elements}
        </List>
      </div>
    );
  }

  elements() {
    if (this.state.users && this.state.users.length !== 0) {
      return this.state.users.map((user) => {
        return (
          <ListItem key={user.account} >
            <ListItemContent avatar="person">
              <Link to={`/user/${user.account}`}>{user.account}</Link>
            </ListItemContent>
            <ListItemAction>
              <Link to={`/match/new/${user.account}`}><FABButton mini ripple colored ><Icon name="whatshot" /></FABButton></Link>
            </ListItemAction>
          </ListItem>
        );
      });
    }
    return [];
  }
}
