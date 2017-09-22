import * as React from 'react';
import { ShotDump, ProfileDump } from '../../../core/Dump';

interface ShotTagProps extends React.Props<any> {
  profile: ProfileDump;
  model: ShotDump;
}

export default class ShotTag extends React.Component<ShotTagProps, {}> {
}
