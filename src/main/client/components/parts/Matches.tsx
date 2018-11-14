import * as React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemContent, ListItemAction, Tooltip, FABButton, Icon } from 'react-mdl';
import moment from 'moment';

import { strings } from '../resources/Strings';
import { MatchResponse } from '../../../dts/MatchResponse';

export interface MatchesProps {
  matches?: MatchResponse[];
  arrowUserLink?: boolean;
}

export default function Matches(props: MatchesProps) {
  const resource = strings();
  const arrowUserLink = props.arrowUserLink === undefined ? true : props.arrowUserLink;
  const matches = props.matches;

  if (!matches) {
    return (
      <>
        <h5>{resource.matchesTitle}</h5>
        <p>{resource.loading}</p>
      </>
    );
  }

  if (!matches.length) {
    return (
      <>
        <h5>{resource.matchesTitle}</h5>
        <p>{resource.none}</p>
      </>
    );
  }

  return (
    <div>
      <h5>{resource.matchesTitle}</h5>
      {matches.map((match, index) => {
        return (
          <ListItem key={index} twoLine>
            <ListItemContent
              avatar="whatshot"
              subtitle={
                <span className="updated">
                  {resource.updatedAt} {moment(match.created).fromNow()}
                </span>
              }
            >
              {match.players &&
                match.players.map((contestant, playerIndex) => (
                  <>
                    {playerIndex !== 0 && <span key={playerIndex}> vs </span>}
                    <span key={`contestant${playerIndex}`}>
                      {arrowUserLink ? (
                        <Link to={`/user/${contestant.account}`}>{contestant.name}</Link>
                      ) : (
                        contestant.name
                      )}
                      {match.winner && match.winner.account === contestant.account ? (
                        <span>
                          <Icon name="mood" className="inline" /> Win
                        </span>
                      ) : (
                        <span>
                          <Icon name="sentiment_very_dissatisfied" className="inline" /> Lose
                        </span>
                      )}
                    </span>
                  </>
                ))}
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
      })}
    </div>
  );
}
