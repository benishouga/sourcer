import * as React from 'react';

import { Button, Menu, MenuItem, Icon, Tooltip } from 'react-mdl';
import { strings } from '../resources/Strings';

import AceEditor from '../parts/AceEditor';

import { fiddle } from '../pages/fiddles/fiddle';
import { escape } from '../pages/fiddles/escape';
import { fewAttack } from '../pages/fiddles/fewAttack';
import { fewMissile } from '../pages/fiddles/fewMissile';
import { fixedBattery } from '../pages/fiddles/fixedBattery';
import { standard } from '../pages/fiddles/standard';

export interface BotSelectorProps {
  onSelect?: (source: string) => void;
  selected?: string;
}

export interface BotSelectorState {
  selectedSource?: string;
  isShowCode?: boolean;
  selectButtonLabel?: string;
}

export default class BotSelector extends React.Component<BotSelectorProps, BotSelectorState> {
  constructor(props: BotSelectorProps) {
    super(props);
    const resource = strings();
    this.state = {
      selectedSource: props.selected,
      isShowCode: false,
      selectButtonLabel: resource.selectEnemy
    };
  }

  public onSelect(source: string, label: string) {
    this.setState({
      selectedSource: source,
      selectButtonLabel: label
    });
    if (this.props.onSelect) {
      this.props.onSelect(source);
    }
  }

  public toggleCodeViewer() {
    this.setState({
      isShowCode: !this.state.isShowCode
    });
  }

  public render() {
    const resource = strings();

    const leftButtonStyle = {
      borderTopLeftRadius: '2px',
      borderBottomLeftRadius: '2px',
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0'
    };

    const rightButtonStyle = {
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
      borderTopRightRadius: '2px',
      borderBottomRightRadius: '2px'
    };

    return (
      <div style={{ marginBottom: '8px' }}>
        <div style={{ position: 'relative', textAlign: 'right' }}>
          <Button raised ripple colored id="enemy-select-menu" style={leftButtonStyle}>
            <Icon name="android" /> {this.state.selectButtonLabel}
          </Button>
          <Menu target="enemy-select-menu" align="right">
            <MenuItem onClick={this.onSelect.bind(this, fiddle, resource.fiddle)}>{resource.fiddle}</MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, fewAttack, resource.fewAttack)}>{resource.fewAttack}</MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, fewMissile, resource.fewMissile)}>
              {resource.fewMissile}
            </MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, escape, resource.escape)}>{resource.escape}</MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, fixedBattery, resource.attacksFromLow)}>
              {resource.attacksFromLow}
            </MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, standard, resource.standard)}>{resource.standard}</MenuItem>
          </Menu>
          <Tooltip label={resource.viewCode} position="bottom">
            <Button raised ripple colored style={rightButtonStyle} onClick={this.toggleCodeViewer.bind(this)}>
              <Icon name={this.state.isShowCode ? 'visibility_off' : 'visibility'} />
            </Button>
          </Tooltip>
        </div>
        <div style={{ display: this.state.isShowCode ? 'block' : 'none' }}>
          <AceEditor
            key={this.state.selectedSource /* HACK */}
            code={this.state.selectedSource || ''}
            className="mdl-shadow--4dp"
            readOnly={true}
          />
        </div>
      </div>
    );
  }
}
