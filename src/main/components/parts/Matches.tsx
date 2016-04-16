import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router';
import User, {UserModel} from '../../service/User';
import {MatchModel} from '../../service/Match';
import {List, ListItem, ListItemContent, ListItemAction} from 'react-mdl';


interface MatchesProps extends React.Props<Matches> {
  userId?: string;
}

interface MatchesState {
  matches?: MatchModel[];
}

export default class Matches extends React.Component<MatchesProps, MatchesState>{
  constructor() {
    super();
    this.state = { matches: null };
  }

  componentDidMount() {
    User.select(this.props.userId).then((user) => {
      this.setState({
        matches: user.matches
      })
    });
  }

  render() {
    let elements = this.elements();
    return (
      <div>
        <p>Matches {this.props.userId}</p>
        <List>
          {elements}
        </List>
      </div>
    );
  }

  contestants(match: MatchModel) {
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
              {contestant}
            </Link>
          </ListItem>
        );
      });
    }
    return [];
  }
}
