import * as React from 'react';
import AceEditor from '../parts/AceEditor';
import Arena, {PlayerInfo} from '../parts/Arena';
import User from '../../service/User';

interface AiEditProps extends React.Props<AiEdit> {
}

interface AiEditState {
  source?: string;
  editingSource?: string;
}

export default class AiEdit extends React.Component<AiEditProps, AiEditState> {
  constructor() {
    super();
    this.state = {
      source: null,
      editingSource: null
    };
  }

  sourceOfResponse: string;

  onTextChange = (value: string) => {
    // this.setState({
    //   editingSource: value
    // });
  };

  componentDidMount() {
    User.select().then((user) => {
      this.sourceOfResponse = user.source;
      this.setState({
        source: user.source,
        editingSource: user.source
      });
    });
  }

  render() {
    console.log('Edit page render');
    let players: PlayerInfo[] = [
      { name: "You", ai: this.state.source, color: '#866', },
      { name: "Enemy", ai: code, color: '#262' }
    ];

    if (this.state.source !== null) {
      return (
        <div className="scr-container mdl-grid">
          <div className="mdl-cell mdl-cell--6-col">
            <div>
              <button>Try</button>
              <button>Save</button>
            </div>
            <div>
              <AceEditor code={this.sourceOfResponse} onChange={this.onTextChange} />
            </div>
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <Arena players={players}  />
          </div>
        </div>
      );
    }

    return (<div>loading...</div>);
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
