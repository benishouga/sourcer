import * as React from 'react';
import {Grid, Cell, Button, Icon} from 'react-mdl';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import AceEditor from '../parts/AceEditor';
import Arena, {PlayerInfo} from '../parts/Arena';
import User from '../../service/User';
import Auth from '../../service/Auth';

interface AiEditProps extends React.Props<AiEdit> {
}

interface AiEditState {
  playerInfo?: PlayerInfo;
}

export default class AiEdit extends React.Component<AiEditProps, AiEditState> {
  constructor() {
    super();
    this.state = {
      playerInfo: null
    };
  }

  sourceOfResponse: string;
  editingSource: string;

  onTextChange = (value: string) => {
    this.editingSource = value;
    this.state.playerInfo.ai = value;
  };

  request: RequestPromise<UserResponse>;

  componentDidMount() {
    this.request = User.select();
    this.request.then((user) => {
      this.sourceOfResponse = user.source;
      this.editingSource = user.source;
      this.setState({
        playerInfo: {
          name: "You",
          ai: user.source,
          color: '#866'
        }
      });
    });
  }

  componentWillUnmount() {
    this.request && this.request.abort();
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    User.update({ source: this.editingSource });
  }


  render() {
    let resource = strings();

    if (this.state.playerInfo !== null) {

      let players: PlayerInfo[] = [
        this.state.playerInfo,
        { name: "Enemy", ai: code, color: '#262' }
      ];

      return (
        <Grid>
          <Cell col={6}>
            <p><Button raised ripple colored onClick={this.handleSubmit.bind(this) }><Icon name="save" /> {resource.save}</Button></p>
            <AceEditor code={this.sourceOfResponse} onChange={this.onTextChange} />
          </Cell>
          <Cell col={6}>
            <Arena players={players} />
          </Cell>
        </Grid>
      );
    }

    return (<div>{resource.loading}</div>);
  }
}

var code = `
var missileAi = function(controller) {
  if(controller.scanEnemy(90, 180)) {
      controller.turnLeft();
  } else {
      controller.turnRight();
  }
  controller.speedUp();
};
var ai = function(controller) {
  if (controller.scanAttack(0, 60, 60)) {
      controller.back();
      controller.descent();
      return;
  }
  if (controller.altitude() < 100) {
      controller.ascent();
      return;
  }
  if (!controller.scanEnemy(0, 180)) {
      controller.turn();
      return;
  }
  if (controller.scanEnemy(0, 30, 200)) {
      if (80 < controller.temperature()) {
          return;
      }
      if (controller.frame() % 5 === 0) {
          controller.fireMissile(missileAi);
      } else {
          controller.fireLaser(0, 8);
      }
      return;
  }
  if (controller.scanEnemy(0, 180, 60)) {
      controller.back();
      return;
  }
  if (controller.scanEnemy(0, 30)) {
      controller.ahead();
      return;
  }
  if (controller.scanEnemy(-45, 90)) {
      controller.descent();
      return;
  }
  controller.ascent();
  return;
};
return ai;
`;
