import * as React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Cell, Button, Icon, Card, CardTitle, CardMenu, Snackbar, Spacer, Menu, MenuItem } from 'react-mdl';

import { strings } from '../resources/Strings';

import { RequestPromise } from '../../utils/fetch';
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
}

export default class AiEdit extends React.Component<React.Props<AiEdit>, AiEditState> {
  // public static contextTypes: React.ValidationMap<any> = {
  //   router: React.PropTypes.object
  // };

  constructor() {
    super();
    this.state = {
      playerInfo: null,
      isSavedSnackbarActive: false
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

  private requests: RequestPromise<any>[] = [];

  public componentDidMount() {
    const request = User.select();
    request.then((user) => {
      if (user.source === undefined) {
        return;
      }
      this.editingSource = user.source;
      this.setState({
        user,
        playerInfo: { name: 'You', ai: user.source, color: '#866' },
        enemyInfo: { name: 'Enemy', ai: fiddle, color: '#262' }
      });
    });
    this.requests.push(request);
  }

  public componentWillUnmount() {
    this.requests.forEach(request => request.abort());
  }

  public save(event?: React.FormEvent<{}>) {
    const request = User.update({ source: this.editingSource });
    request.then(() => {
      this.showSavedSnackbar();
    });
    this.requests.push(request);
  }

  public saveAndFindAgainst() {
    const request = User.update({ source: this.editingSource });
    request.then(() => {
      const context = this.context as any;
      context.router.replace('/');
    });
    this.requests.push(request);
  }

  public reload(event?: React.FormEvent<{}>) {
    // HACK...
    (this.refs.arena as any).onReload();
  }

  public showSavedSnackbar() {
    this.setState({ isSavedSnackbarActive: true });
  }

  public hideSavedSnackbar() {
    this.setState({ isSavedSnackbarActive: false });
  }

  public render() {
    const resource = strings();

    if (this.state.playerInfo !== null) {

      const players: PlayerInfo[] = [];
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
