import React, { useState } from 'react';

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

const BotSelector: React.FC<BotSelectorProps> = (props) => {
  const resource = strings();
  const [selectedSource, setSelectedSource] = useState<string | undefined>(props.selected);
  const [isShowCode, setIsShowCode] = useState<boolean>(false);
  const [selectButtonLabel, setSelectButtonLabel] = useState<string>(resource.selectEnemy);

  const onSelect = (source: string, label: string) => {
    setSelectedSource(source);
    setSelectButtonLabel(label);
    if (props.onSelect) {
      props.onSelect(source);
    }
  };

  const toggleCodeViewer = () => {
    setIsShowCode(!isShowCode);
  };

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
          <Icon name="android" /> {selectButtonLabel}
        </Button>
        <Menu target="enemy-select-menu" align="right">
          <MenuItem onClick={() => onSelect(fiddle, resource.fiddle)}>{resource.fiddle}</MenuItem>
          <MenuItem onClick={() => onSelect(fewAttack, resource.fewAttack)}>{resource.fewAttack}</MenuItem>
          <MenuItem onClick={() => onSelect(fewMissile, resource.fewMissile)}>{resource.fewMissile}</MenuItem>
          <MenuItem onClick={() => onSelect(escape, resource.escape)}>{resource.escape}</MenuItem>
          <MenuItem onClick={() => onSelect(fixedBattery, resource.attacksFromLow)}>{resource.attacksFromLow}</MenuItem>
          <MenuItem onClick={() => onSelect(standard, resource.standard)}>{resource.standard}</MenuItem>
        </Menu>
        <Tooltip label={resource.viewCode} position="bottom">
          <Button raised ripple colored style={rightButtonStyle} onClick={toggleCodeViewer}>
            <Icon name={isShowCode ? 'visibility_off' : 'visibility'} />
          </Button>
        </Tooltip>
      </div>
      <div style={{ display: isShowCode ? 'block' : 'none' }}>
        <AceEditor
          key={selectedSource /* HACK */}
          code={selectedSource || ''}
          className="mdl-shadow--4dp"
          readOnly={true}
        />
      </div>
    </div>
  );
};

export default BotSelector;
