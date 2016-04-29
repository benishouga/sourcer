import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router';
import User from '../../service/User';
import {List, ListItem, ListItemContent, ListItemAction, Icon, FABButton, Tooltip} from 'react-mdl';
import * as moment from 'moment';
import {RequestPromise} from '../../utils/fetch';

require('moment/locale/ja');
moment.locale('ja');

interface RecentUpdatedUsersProps extends React.Props<RecentUpdatedUsers> {
  account?: string;
}

interface RecentUpdatedUsersState {
  users?: UserResponse[];
}

export default class RecentUpdatedUsers extends React.Component<RecentUpdatedUsersProps, RecentUpdatedUsersState>{
  constructor() {
    super();
    this.state = { users: null };
  }

  request: RequestPromise<UserResponse[]>;

  componentDidMount() {
    this.request = User.recent();
    this.request.then((users) => {
      this.setState({
        users: users
      });
    });
  }

  componentWillUnmount() {
    this.request && this.request.abort();
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
          <ListItem key={user.account} twoLine >
            <ListItemContent avatar="person" subtitle="Xx戦 Xx勝 メンバー：Aaa, Bbb, Ccc, Ddd, Eee">
              <Link to={`/user/${user.account}`}>{user.account}</Link> <span className="updated">{moment(user.updated).fromNow() }</span>
            </ListItemContent>
            <ListItemAction>
              <Tooltip label="Fight" position="right">
                <Link to={`/match/new/${user.account}`}><FABButton mini ripple colored ><Icon name="whatshot" /></FABButton></Link>
              </Tooltip>
            </ListItemAction>
          </ListItem>
        );
      });
    }
    return [];
  }
}
