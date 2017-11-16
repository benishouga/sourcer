import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Icon, Card, CardTitle, CardMenu, Snackbar, Spacer, Menu, MenuItem } from 'react-mdl';

import { strings } from '../resources/Strings';

import { AbortController } from '../../utils/fetch';
import AceEditor from '../parts/AceEditor';
import ArenaTag from '../parts/ArenaTag';
import { PlayerInfo } from '../../arenaWorker';
import BotSelector from '../parts/BotSelector';
import User from '../../service/User';
import Auth from '../../service/Auth';

import { fiddle } from './fiddles/fiddle';

interface AiEditState {
  user?: UserResponse;
  playerInfo: PlayerInfo | null;
  enemyInfo?: PlayerInfo;
  isSavedSnackbarActive?: boolean;
  redirectToTop: boolean;
}

export default class Edit extends React.Component<{}, AiEditState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      playerInfo: null,
      isSavedSnackbarActive: false,
      redirectToTop: false
    };
  }

  private editingSource: string;

  private onTextChange = (value: string) => {
    this.editingSource = value;
    if (this.state.playerInfo) {
      this.state.playerInfo.ai = value;
    }
  }

  private selectBot = (bot: string) => {
    if (this.state.enemyInfo) {
      this.state.enemyInfo.ai = bot;
    }
    this.reload();
  }

  private abortController: AbortController;

  public async componentDidMount() {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    const user = await User.select({ signal }).catch(error => console.log(error));
    if (!user || user.source === undefined) {
      return;
    }
    this.editingSource = user.source;
    this.setState({
      user,
      playerInfo: { name: 'You', ai: user.source, color: '#866' },
      enemyInfo: { name: 'Enemy', ai: fiddle, color: '#262' }
    });
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public async save(event?: React.FormEvent<{}>) {
    const signal = this.abortController.signal;
    await User.update({ signal, user: { source: this.editingSource } }).catch(error => console.log(error));
    this.showSavedSnackbar();
  }

  public async saveAndFindAgainst() {
    const signal = this.abortController.signal;
    await User.update({ signal, user: { source: this.editingSource } }).catch(error => console.log(error));
    this.setState({ redirectToTop: true });
  }

  public reload(event?: React.FormEvent<{}>) {
    (this.refs.arena as ArenaTag).onReload();
  }

  public showSavedSnackbar() {
    this.setState({ isSavedSnackbarActive: true });
  }

  public hideSavedSnackbar() {
    this.setState({ isSavedSnackbarActive: false });
  }

  public render() {
    const { redirectToTop } = this.state;

    if (redirectToTop) {
      return <Redirect to={'/'} />;
    }

    const resource = strings();

    if (this.state.playerInfo !== null) {

      const players: PlayerInfo[] = [];
      players.push(this.state.playerInfo);
      if (this.state.enemyInfo) {
        players.push(this.state.enemyInfo);
      }

      return (
        <Grid>
          <Cell col={6} tablet={12} phone={12}>
            <Card shadow={0} style={{ width: '100%', marginBottom: '8px', minHeight: '53px' }}>
              <CardTitle>
                <Button raised ripple colored onClick={this.save.bind(this)}><Icon name="save" /> {resource.save}</Button>
                <Spacer />
                <Button raised ripple colored onClick={this.saveAndFindAgainst.bind(this)} style={{ marginLeft: '8px' }}>
                  <Icon name="whatshot" /> {resource.saveAndFindAgainst}
                </Button>
                <Button raised ripple colored onClick={this.reload.bind(this)} style={{ marginLeft: '8px' }}><Icon name="play_arrow" /> {resource.test}</Button>
              </CardTitle>
            </Card>
            <AceEditor code={this.editingSource} onChange={this.onTextChange} onSave={this.save.bind(this)} className="mdl-shadow--2dp" readOnly={false} />
            <Snackbar active={this.state.isSavedSnackbarActive || false} onTimeout={this.hideSavedSnackbar.bind(this)}>{resource.saved}</Snackbar>
          </Cell>
          <Cell col={6} tablet={12} phone={12}>
            <BotSelector selected={fiddle} onSelect={this.selectBot} />
            <ArenaTag players={players} ref="arena" scale={1} isDemo={false} />
          </Cell>
        </Grid >
      );
    }

    return (<div>{resource.loading}</div>);
  }
}
