import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemContent, ListItemAction, Button, Tooltip, FABButton, Icon } from 'react-mdl';
import * as moment from 'moment';

import { strings } from '../resources/Strings';

import { RequestPromise } from '../../utils/fetch';
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

  private request: RequestPromise<UserResponse>;

  public componentWillReceiveProps(nextProps: MatchesProps) {
    this.setState({ matches: nextProps.matches });
  }

  public componentDidMount() {
    if (!this.props.matches) {
      this.request = User.select(this.props.account);
      this.request.then((user) => {
        this.setState({
          matches: user.matches
        });
      });
    }
  }

  public componentWillUnmount() {
    if (this.request) {
      this.request.abort();
    }
  }

  public componentWillUpdate(nextProps: MatchesProps, nextState: MatchesState) {
    if (!nextProps.matches) {
      this.request = User.select(nextProps.account);
      this.request.then((user) => {
        this.setState({
          matches: user.matches
        });
      });
    }
  }

  public render() {
    const resource = strings();
    const elements = this.elements();
    return (
      <div>
        <p>{resource.matchesTitle} {this.props.account}</p>
        {elements}
      </div>
    );
  }

  private elements() {
    const resource = strings();
    if (this.state.matches && this.state.matches.length !== 0) {
      return this.state.matches.map((match, index) => {
        const subtitle = (<span className="updated">{resource.updatedAt} {moment(match.created).fromNow()}</span>);
        return (
          <ListItem key={index} twoLine >
            <ListItemContent avatar="whatshot" subtitle={subtitle}>
              {this.players(match)}
            </ListItemContent>
            <ListItemAction>
              <Tooltip label={resource.viewMatch} position="right">
                <Link to={`/match/${match._id}`}><FABButton mini ripple colored ><Icon name="play_arrow" /></FABButton></Link>
              </Tooltip>
            </ListItemAction>
          </ListItem>
        );
      });
    }
    return [];
  }

  private players(match: MatchResponse) {
    const players: (Element | React.ReactElement<{}> | null)[] = [];
    if (!match.players) {
      return null;
    }
    match.players.map((contestant) => {
      if (!match.winner) {
        return null;
      }
      const isWin = match.winner.account === contestant.account;
      const winOrLoseIcon = isWin ?
        (<span><Icon name="mood" className="inline" /> Win</span>) :
        (<span><Icon name="sentiment_very_dissatisfied" className="inline" /> Lose</span>);

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
