import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemContent, ListItemAction, Tooltip, FABButton, Icon } from 'react-mdl';
import moment from 'moment';

import { strings } from '../resources/Strings';
import { MatchResponse } from '../../../dts/MatchResponse';

export interface PublishGamesProps {
  matches?: MatchResponse[];
}

const PublishGames: React.FC<PublishGamesProps> = ({ matches }) => {
  const resource = strings();
  const elements = elements();

  return (
    <div>
      <h5>{resource.matchesTitle}</h5>
      {elements}
    </div>
  );

  function elements() {
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
    const players: (Element | React.ReactElement<{}>)[] = [];
    if (!match.players) {
      return null;
    }
    match.players
      .map((player, index) => {
        let winOrLoseIcon = null;
        if (match.winner) {
          winOrLoseIcon =
            match.winner.account === player.account ? (
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
          <span key={`player${index}`}>
            {player.name} {winOrLoseIcon}
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

export default PublishGames;
