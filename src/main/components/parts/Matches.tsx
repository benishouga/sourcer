import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router';
import {List, ListItem, ListItemContent, ListItemAction, Button} from 'react-mdl';

import {RequestPromise} from '../../utils/fetch';
import User from '../../service/User';

interface MatchesProps extends React.Props<Matches> {
  account?: string;
}

interface MatchesState {
  matches?: MatchResponse[];
}

export default class Matches extends React.Component<MatchesProps, MatchesState>{
  constructor() {
    super();
    this.state = { matches: null };
  }

  request: RequestPromise<UserResponse>;

  componentDidMount() {
    this.request = User.select(this.props.account);
    this.request.then((user) => {
      this.setState({
        matches: user.matches
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
        <p>Matches {this.props.account}</p>
        {elements}
      </div>
    );
  }

  contestants(match: MatchResponse) {
    let contestants: React.ReactElement<any>[] = [];
    match.contestants.map((contestant) => {
      let isWin = match.winner.account === contestant.account;
      return (<span className={isWin ? "win" : "lose"}>{contestant.account}</span>);
    }).forEach((element) => {
      if (contestants.length !== 0) {
        contestants.push(<span> vs </span>);
      }
      contestants.push(element);
    });
    return contestants;
  }

  elements() {
    if (this.state.matches && this.state.matches.length !== 0) {
      return this.state.matches.map((match) => {

        let contestant = this.contestants(match);

        return (
          <ListItem key={match._id}>
            <Link to={`/match/${match._id}`}>
              <Button ripple>{contestant}</Button>
            </Link>
          </ListItem>
        );
      });
    }
    return [];
  }
}
