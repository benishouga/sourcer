import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemContent, ListItemAction, Button, Tooltip, FABButton, Icon } from 'react-mdl';
import * as moment from 'moment';

import { strings } from '../resources/Strings';

import { AbortController } from '../../utils/fetch';
import User from '../../service/User';

interface MatchesProps extends React.Props<Matches> {
  account?: string;
  matches?: MatchResponse[];
}

interface MatchesState {
  matches?: MatchResponse[];
}

export default class Matches extends React.Component<MatchesProps, MatchesState> {
  constructor(props: MatchesProps) {
    super();
    this.state = { matches: props.matches };
  }

  private abortController: AbortController;

  public componentWillReceiveProps(nextProps: MatchesProps) {
    this.setState({ matches: nextProps.matches });
  }

  private async loadMatches(account?: string) {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.setState({ matches: undefined });
    const user = await User.select({ signal, account }).catch(error => console.log(error));
    if (user) { this.setState({ matches: user.matches }); }
  }

  public async componentDidMount() {
    if (!this.props.matches) {
      this.loadMatches(this.props.account);
    }
  }

  public componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  public async componentWillUpdate(nextProps: MatchesProps, nextState: MatchesState) {
    if (!nextProps.matches) {
      this.abortController.abort();
      this.loadMatches(nextProps.account);
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
    return <p>{resource.none}</p>;
  }

  private players(match: MatchResponse) {
    const players: (Element | React.ReactElement<{}> | null)[] = [];
    if (!match.players) {
      return null;
    }
    match.players.map((contestant, index) => {
      let winOrLoseIcon = null;
      if (match.winner) {
        winOrLoseIcon = match.winner.account === contestant.account ?
          (<span><Icon name="mood" className="inline" /> Win</span>) :
          (<span><Icon name="sentiment_very_dissatisfied" className="inline" /> Lose</span>);
      }

      return (
        <span key={'contestant' + index}>
          <Link to={`/user/${contestant.account}`}>{contestant.name}</Link>
          {winOrLoseIcon}
        </span>
      );
    }).forEach((element, index) => {
      if (players.length !== 0) {
        players.push(<span key={index}> vs </span>);
      }
      players.push(element);
    });
    return players;
  }
}
