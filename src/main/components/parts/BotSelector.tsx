import * as React from 'react';

import {Button, Menu, MenuItem, Icon, Tooltip} from 'react-mdl';
import {strings} from '../resources/Strings';

import AceEditor from '../parts/AceEditor';

import {fiddle} from '../pages/fiddles/fiddle';
import {escape} from '../pages/fiddles/escape';
import {fewAttack} from '../pages/fiddles/fewAttack';
import {fewMissile} from '../pages/fiddles/fewMissile';
import {fixedBattery} from '../pages/fiddles/fixedBattery';
import {standard} from '../pages/fiddles/standard';

interface BotSelectorProps extends React.Props<BotSelector> {
  onSelect?: (source: string) => void
  selected?: string;
}

interface BotSelectorStats {
  selectedSource?: string;
  isShowCode?: boolean;
  selectButtonLabel?: string;
}

export default class BotSelector extends React.Component<BotSelectorProps, BotSelectorStats> {
  constructor(props: BotSelectorProps) {
    super();
    let resource = strings();
    this.state = {
      selectedSource: props.selected,
      isShowCode: false,
      selectButtonLabel: resource.select_enemy
    };
  }

  onSelect(source: string, label: string) {
    this.setState({
      selectedSource: source,
      selectButtonLabel: label
    });
    this.props.onSelect(source);
  }

  toggleCodeViewer() {
    this.setState({
      isShowCode: !this.state.isShowCode
    });
  }

  render() {
    let resource = strings();

    let leftButtonStyle = {
      borderTopLeftRadius: '2px',
      borderBottomLeftRadius: '2px',
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0'
    };

    let rightButtonStyle = {
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
      borderTopRightRadius: '2px',
      borderBottomRightRadius: '2px'
    };

    return (
      <div style={{ marginBottom: '8px' }}>
        <div style={{ position: 'relative', textAlign: 'right' }}>
          <Button raised ripple colored id="enemy-select-menu" style={leftButtonStyle}><Icon name="android" /> {this.state.selectButtonLabel}</Button>
          <Menu target="enemy-select-menu" align="right">
            <MenuItem onClick={this.onSelect.bind(this, fiddle, resource.fiddle) }>{resource.fiddle}</MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, fewAttack, resource.few_attack) }>{resource.few_attack}</MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, fewMissile, resource.few_missile) }>{resource.few_missile}</MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, escape, resource.escape) }>{resource.escape}</MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, fixedBattery, resource.fixed_battery) }>{resource.fixed_battery}</MenuItem>
            <MenuItem onClick={this.onSelect.bind(this, standard, resource.standard) }>{resource.standard}</MenuItem>
          </Menu>
          <Tooltip label={resource.view_code} position="bottom">
            <Button raised ripple colored mini style={rightButtonStyle} onClick={this.toggleCodeViewer.bind(this) }>
              <Icon name={this.state.isShowCode ? "visibility_off" : "visibility"} />
            </Button>
          </Tooltip>
        </div>
        <div style={{ display: this.state.isShowCode ? 'block' : 'none' }}>
          <AceEditor key={this.state.selectedSource /* HACK */} code={this.state.selectedSource} className="mdl-shadow--4dp" readOnly={true} />
        </div>
      </div>
    );
  }
}
