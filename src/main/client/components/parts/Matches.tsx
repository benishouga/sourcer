import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemContent, ListItemAction, Tooltip, FABButton, Icon } from 'react-mdl';
import moment from 'moment';

import { strings } from '../resources/Strings';
import { MatchResponse } from '../../../dts/MatchResponse';

import User from '../../service/User';

export interface MatchesProps {
  account?: string;
  matches?: MatchResponse[];
}

const Matches: React.FC<MatchesProps> = (props) => {
  const [matches, setMatches] = useState<MatchResponse[] | undefined>(props.matches);

  const abortController = new AbortController();

  useEffect(() => {
    if (!props.matches) {
      loadMatches(props.account);
    }

    return () => {
      abortController.abort();
    };
  }, [props.matches, props.account]);

  const loadMatches = async (account?: string) => {
    const signal = abortController.signal;
    setMatches(undefined);
    const user = await User.select({ signal, account }).catch(error => console.log(error));
    if (user) {
      setMatches(user.matches);
    }
  };

  useEffect(() => {
    if (!props.matches) {
      loadMatches(props.account);
    }
  }, [props.matches, props.account]);

  const resource = strings();
  const elements = elements();

  return (
    <div>
      <h5>
        {resource.matchesTitle} {props.account}
      </h5>
      {elements}
    </div>
  );

  function elements() {
    const resource = strings();
    if (matches && matches.length !== 0) {
      return matches.map((match, index) => {
        const subtitle = (
          <span className="updated">
            {resource.updatedAt} {moment(match.created).fromNow()}
          </span>
        );
        return (
          <ListItem key={index} twoLine>
            <ListItemContent avatar="whatshot" subtitle={subtitle}>
              {players(match)}
            </ListItemContent>
            <ListItemAction>
              <Tooltip label={resource.viewMatch} position="right">
                <Link to={`/match/${match._id}`}>
                  <FABButton mini ripple colored>
                    <Icon name="play_arrow" />
                  </FABButton>
                </Link>
              </Tooltip>
            </ListItemAction>
          </ListItem>
        );
      });
    }
    return <p>{resource.none}</p>;
  }

  function players(match: MatchResponse) {
    const players: (Element | React.ReactElement<{}> | null)[] = [];
    if (!match.players) {
      return null;
    }
    match.players
      .map((contestant, index) => {
        let winOrLoseIcon = null;
        if (match.winner) {
          winOrLoseIcon =
            match.winner.account === contestant.account ? (
              <span>
                <Icon name="mood" className="inline" /> Win
              </span>
            ) : (
              <span>
                <Icon name="sentiment_very_dissatisfied" className="inline" /> Lose
              </span>
            );
        }

        return (
          <span key={`contestant${index}`}>
            <Link to={`/user/${contestant.account}`}>{contestant.name}</Link> {winOrLoseIcon}
          </span>
        );
      })
      .forEach((element, index) => {
        if (players.length !== 0) {
          players.push(<span key={index}> vs </span>);
        }
        players.push(element);
      });
    return players;
  }
};

export default Matches;
