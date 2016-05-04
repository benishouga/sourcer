import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router';
import {List, ListItem, ListItemContent, ListItemAction, Button, Tooltip, FABButton, Icon} from 'react-mdl';
import * as moment from 'moment';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import User from '../../service/User';

interface MatchesProps extends React.Props<Matches> {
  account?: string;
  matches?: MatchResponse[];
}

interface MatchesState {
  matches?: MatchResponse[];
}

export default class Matches extends React.Component<MatchesProps, MatchesState>{
  constructor(props: MatchesProps) {
    super();
    this.state = { matches: props.matches };
  }

  request: RequestPromise<UserResponse>;

  componentWillReceiveProps(nextProps: MatchesProps) {
    this.setState({ matches: nextProps.matches });
  }

  componentDidMount() {
    if (!this.props.matches) {
      this.request = User.select(this.props.account);
      this.request.then((user) => {
        this.setState({
          matches: user.matches
        });
      });
    }
  }

  componentWillUnmount() {
    this.request && this.request.abort();
  }

  componentWillUpdate(nextProps: MatchesProps, nextState: MatchesState) {
    if (!nextProps.matches) {
      this.request = User.select(nextProps.account);
      this.request.then((user) => {
        this.setState({
          matches: user.matches
        });
      });
    }
  }

  render() {
    let resource = strings();
    let elements = this.elements();
    return (
      <div>
        <p>{resource.matches_title} {this.props.account}</p>
        {elements}
      </div>
    );
  }

  elements() {
    let resource = strings();
    if (this.state.matches && this.state.matches.length !== 0) {
      return this.state.matches.map((match, index) => {
        let subtitle = (<span className="updated">{resource.updated_at} {moment(match.created).fromNow() }</span>);
        return (
          <ListItem key={index} twoLine >
            <ListItemContent avatar="whatshot" subtitle={subtitle}>
              {this.players(match) }
            </ListItemContent>
            <ListItemAction>
              <Tooltip label={resource.view_match} position="right">
                <Link to={`/match/${match._id}`}><FABButton mini ripple colored ><Icon name="play_arrow" /></FABButton></Link>
              </Tooltip>
            </ListItemAction>
          </ListItem>
        );
      });
    }
    return [];
  }

  players(match: MatchResponse) {
    let players: React.ReactElement<any>[] = [];
    match.players.map((contestant) => {
      let isWin = match.winner.account === contestant.account;
      let winOrLoseIcon = isWin ? (<span><Icon name="mood" className="inline" /> Win</span>) : (<span><Icon name="sentiment_very_dissatisfied" className="inline" /> Lose</span>);

      return (<span><span className={isWin ? 'win' : 'lose'}><Link to={`/user/${contestant.account}`}>{contestant.name}</Link></span> {winOrLoseIcon}</span>);
    }).forEach((element) => {
      if (players.length !== 0) {
        players.push(<span> vs </span>);
      }
      players.push(element);
    });
    return players;
  }
}
