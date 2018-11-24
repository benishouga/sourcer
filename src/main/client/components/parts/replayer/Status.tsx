import * as React from 'react';

import Configs from '../../../../core/Configs';
import { strings } from '../../resources/Strings';
import { SourcerDump, ProfileDump } from '../../../../core/Dump';
import { Card, CardTitle, CardText, ProgressBar } from 'react-mdl';

interface StatusProps {
  model: SourcerDump;
  profile: ProfileDump;
}

export default function Status(props: StatusProps) {
  const resource = strings();

  const shield = props.model.h / Configs.INITIAL_SHIELD * 100;

  let backgroundColor: string;
  if (50 < shield) {
    backgroundColor = '#fff';
  } else if (25 < shield) {
    backgroundColor = '#ff8';
  } else {
    backgroundColor = '#f44';
  }

  return (
    <Card shadow={0} style={{ backgroundColor, width: '100%', margin: 'auto' }}>
      <CardTitle>
        <div style={{ height: '32px', width: '16px', marginRight: '8px', backgroundColor: props.profile.color }} />{' '}
        {props.profile.name}
      </CardTitle>
      <CardText style={{ paddingTop: '0px' }}>
        <div>
          <div className="status">
            <span className="title">{resource.shield}</span>
            <span className="main">{props.model.h}</span> / {Configs.INITIAL_SHIELD}
          </div>
          <div>
            <ProgressBar
              className="progress-status progress-shield"
              progress={props.model.h / Configs.INITIAL_SHIELD * 100}
            />
          </div>
        </div>
        <div>
          <div className="status">
            <span className="title">{resource.fuel}</span>
            <span className="main">{props.model.f}</span> / {Configs.INITIAL_FUEL}
          </div>
          <div>
            <ProgressBar
              className="progress-status progress-fuel"
              progress={props.model.f / Configs.INITIAL_FUEL * 100}
            />
          </div>
        </div>
        <div>
          <div className="status">
            <span className="title">{resource.temperature}</span>
            <span className="main">{props.model.t}</span> / {Configs.OVERHEAT_BORDER}
          </div>
          <div>
            <ProgressBar
              className="progress-status progress-temperature"
              progress={props.model.t / Configs.OVERHEAT_BORDER * 100}
            />
          </div>
        </div>
        <div>
          <div className="status">
            <span className="title">{resource.ammo}</span>
            <span className="main">{props.model.a}</span> / {Configs.INITIAL_MISSILE_AMMO}
          </div>
          <div>
            <ProgressBar
              className="progress-status progress-ammo"
              progress={props.model.a / Configs.INITIAL_MISSILE_AMMO * 100}
            />
          </div>
        </div>
      </CardText>
    </Card>
  );
}
