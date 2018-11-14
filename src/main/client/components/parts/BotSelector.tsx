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

const LEFT_BUTTON_STYLE = {
  borderTopLeftRadius: '2px',
  borderBottomLeftRadius: '2px',
  borderTopRightRadius: '0',
  borderBottomRightRadius: '0'
};

const RIGHT_BUTTON_STYLE = {
  borderTopLeftRadius: '0',
  borderBottomLeftRadius: '0',
  borderTopRightRadius: '2px',
  borderBottomRightRadius: '2px'
};

export default function BotSelector(props: BotSelectorProps) {
  const resource = strings();
  const [selectedSource, setSelectedSource] = React.useState('');
  const [selectButtonLabel, setSelectButtonLabel] = React.useState(resource.selectEnemy);
  const [isShowCode, setIsShowCode] = React.useState(false);

  function onSelect(source: string, label: string) {
    setSelectButtonLabel(label);
    setSelectedSource(source);
    if (props.onSelect) {
      props.onSelect(source);
    }
  }

  function toggleCodeViewer() {
    setIsShowCode(!isShowCode);
  }

  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ position: 'relative', textAlign: 'right' }}>
        <Button raised ripple colored id="enemy-select-menu" style={LEFT_BUTTON_STYLE}>
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
          <Button raised ripple colored style={RIGHT_BUTTON_STYLE} onClick={() => toggleCodeViewer()}>
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
}
