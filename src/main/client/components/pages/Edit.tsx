import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Icon, Card, CardTitle, Snackbar, Spacer } from 'react-mdl';

import { strings } from '../resources/Strings';
import { UserResponse } from '../../../dts/UserResponse';

import AceEditor from '../parts/AceEditor';
import ArenaTag from '../parts/ArenaTag';
import { PlayerInfo } from '../../arenaWorker';
import BotSelector from '../parts/BotSelector';
import User from '../../service/User';

import { fiddle } from './fiddles/fiddle';

const Edit: React.FC = () => {
  const [user, setUser] = useState<UserResponse | undefined>(undefined);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [enemyInfo, setEnemyInfo] = useState<PlayerInfo | undefined>(undefined);
  const [isSavedSnackbarActive, setIsSavedSnackbarActive] = useState<boolean>(false);
  const [redirectToTop, setRedirectToTop] = useState<boolean>(false);

  const editingSource = useRef<string>('');

  const onTextChange = (value: string) => {
    editingSource.current = value;
    if (playerInfo) {
      setPlayerInfo({ ...playerInfo, source: value });
    }
  };

  const selectBot = (bot: string) => {
    if (enemyInfo) {
      setEnemyInfo({ ...enemyInfo, source: bot });
    }
    reload();
  };

  const abortController = useRef<AbortController>(new AbortController());

  useEffect(() => {
    const fetchUser = async () => {
      const signal = abortController.current.signal;
      const user = await User.select({ signal }).catch(error => console.log(error));
      if (!user || user.source === undefined) {
        return;
      }
      editingSource.current = user.source;
      setUser(user);
      setPlayerInfo({ name: 'You', source: user.source, color: '#866' });
      setEnemyInfo({ name: 'Enemy', source: fiddle, color: '#262' });
    };

    fetchUser();

    return () => {
      abortController.current.abort();
    };
  }, []);

  const save = async (_event?: React.FormEvent<{}>) => {
    const signal = abortController.current.signal;
    await User.update({ signal, user: { source: editingSource.current } }).catch(error => console.log(error));
    showSavedSnackbar();
  };

  const saveAndFindAgainst = async () => {
    const signal = abortController.current.signal;
    await User.update({ signal, user: { source: editingSource.current } }).catch(error => console.log(error));
    setRedirectToTop(true);
  };

  const reload = (_event?: React.FormEvent<{}>) => {
    (arenaRef.current as any).onReload();
  };

  const showSavedSnackbar = () => {
    setIsSavedSnackbarActive(true);
  };

  const hideSavedSnackbar = () => {
    setIsSavedSnackbarActive(false);
  };

  const arenaRef = useRef<ArenaTag | null>(null);

  if (redirectToTop) {
    return <Redirect to={'/'} />;
  }

  const resource = strings();

  if (playerInfo !== null) {
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
            code={editingSource.current}
            onChange={onTextChange}
            onSave={save}
            className="mdl-shadow--2dp"
            readOnly={false}
          />
          <Snackbar active={isSavedSnackbarActive} onTimeout={hideSavedSnackbar}>
            {resource.saved}
          </Snackbar>
        </Cell>
        <Cell col={6} tablet={12} phone={12}>
          <BotSelector selected={fiddle} onSelect={selectBot} />
          <ArenaTag players={players} ref={arenaRef} scale={1} isDemo={false} />
        </Cell>
      </Grid>
    );
  }
  return (
    <Grid>
      <Cell col={12}>{resource.loading}</Cell>
    </Grid>
  );
};

export default Edit;
