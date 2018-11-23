import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Icon, Card, CardTitle, Snackbar, Spacer } from 'react-mdl';

import { strings } from '../resources/Strings';

import AceEditor from '../parts/AceEditor';
import ArenaTag from '../parts/ArenaTag';
import { PlayerInfo } from '../../arenaWorker';
import BotSelector from '../parts/BotSelector';
import User from '../../service/User';

import { useUser } from '../hooks/api-hooks';

import { fiddle } from './fiddles/fiddle';

export default function Edit() {
  const [playerInfo, setPlayerInfo] = React.useState<PlayerInfo | null>(null);
  const [enemyInfo, setEnemyInfo] = React.useState<PlayerInfo | null>(null);
  const [isSavedSnackbarActive, setIsSavedSnackbarActive] = React.useState<boolean>(false);
  const [redirectToTop, setRedirectToTop] = React.useState<boolean>(false);
  const arenaRef = React.useRef<ArenaTag>(null);

  const user = useUser();

  function onTextChange(value: string) {
    if (playerInfo) {
      playerInfo.source = value;
    }
  }

  function selectBot(bot: string) {
    if (enemyInfo) {
      enemyInfo.source = bot;
    }
    reload();
  }

  async function save(_event?: React.FormEvent<{}>) {
    if (!playerInfo) {
      return;
    }
    await User.update({ user: { source: playerInfo.source } }).catch(error => console.log(error));
    showSavedSnackbar();
  }

  async function saveAndFindAgainst() {
    if (!playerInfo) {
      return;
    }
    await User.update({ user: { source: playerInfo.source } }).catch(error => console.log(error));
    setRedirectToTop(true);
  }

  function reload(_event?: React.FormEvent<{}>) {
    if (arenaRef.current) {
      arenaRef.current.onReload();
    }
  }

  function showSavedSnackbar() {
    setIsSavedSnackbarActive(true);
  }

  function hideSavedSnackbar() {
    setIsSavedSnackbarActive(false);
  }

  React.useMemo(
    () => {
      if (!user) {
        return;
      }
      setPlayerInfo({ name: 'You', source: user.source || '', color: '#866' });
      setEnemyInfo({ name: 'Enemy', source: fiddle, color: '#262' });
    },
    [user]
  );

  if (redirectToTop) {
    return <Redirect to={'/'} />;
  }

  const resource = strings();

  if (playerInfo === null) {
    return (
      <Grid>
        <Cell col={12}>{resource.loading}</Cell>
      </Grid>
    );
  }

  const players: PlayerInfo[] = [];
  players.push(playerInfo);
  if (enemyInfo) {
    players.push(enemyInfo);
  }
  return (
    <Grid>
      <Cell col={6} tablet={12} phone={12}>
        <Card shadow={0} style={{ width: '100%', marginBottom: '8px', minHeight: '53px' }}>
          <CardTitle>
            <Button raised ripple colored onClick={save}>
              <Icon name="save" /> {resource.save}
            </Button>
            <Spacer />
            <Button raised ripple colored onClick={saveAndFindAgainst} style={{ marginLeft: '8px' }}>
              <Icon name="whatshot" /> {resource.saveAndFindAgainst}
            </Button>
            <Button raised ripple colored onClick={reload} style={{ marginLeft: '8px' }}>
              <Icon name="play_arrow" /> {resource.test}
            </Button>
          </CardTitle>
        </Card>
        <AceEditor
          code={playerInfo.source}
          onChange={onTextChange}
          onSave={save}
          className="mdl-shadow--2dp"
          readOnly={false}
        />
        <Snackbar active={isSavedSnackbarActive || false} onTimeout={hideSavedSnackbar}>
          {resource.saved}
        </Snackbar>
      </Cell>
      <Cell col={6} tablet={12} phone={12}>
        <BotSelector initialBotSource={fiddle} onSelect={selectBot} />
        <ArenaTag players={players} ref={arenaRef} scale={1} isDemo={false} />
      </Cell>
    </Grid>
  );
}
