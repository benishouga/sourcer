import * as React from 'react';
import { Icon } from 'react-mdl';
import { strings } from '../resources/Strings';

export interface WinsAndLosesProps {
  wins?: number;
  losses?: number;
}

export default function WinsAndLoses(props: WinsAndLosesProps) {
  const resource = strings();
  return (
    <>
      <Icon name="mood" className="inline" /> {props.wins || 0} {resource.wins}
      &ensp;
      <Icon name="sentiment_very_dissatisfied" className="inline" /> {props.losses || 0} {resource.losses}
    </>
  );
}
