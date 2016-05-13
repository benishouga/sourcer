import * as React from 'react';
import {Link} from 'react-router';
import {Grid, Cell, Button, Icon, Card, CardTitle, CardMenu, Snackbar, Spacer, Menu, MenuItem} from 'react-mdl';

import {strings} from '../resources/Strings';

import {RequestPromise} from '../../utils/fetch';
import AceEditor from '../parts/AceEditor';
import Arena, {PlayerInfo} from '../parts/Arena';
import BotSelector from '../parts/BotSelector';
import User from '../../service/User';
import Auth from '../../service/Auth';

import {fiddle} from './fiddles/fiddle';

interface AiEditProps extends React.Props<AiEdit> {
}

interface AiEditState {
  user?: UserResponse;
  playerInfo?: PlayerInfo;
  enemyInfo?: PlayerInfo;
  isSavedSnackbarActive?: boolean;
}

export default class AiEdit extends React.Component<AiEditProps, AiEditState> {
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      playerInfo: null,
      isSavedSnackbarActive: false
    };
  }

  sourceOfResponse: string;
  editingSource: string;

  onTextChange = (value: string) => {
    this.editingSource = value;
    this.state.playerInfo.ai = value;
  };

  selectBot = (bot: string) => {
    this.state.enemyInfo.ai = bot;
    this.reload();
  };

  requests: RequestPromise<any>[] = [];

  componentDidMount() {
    let request = User.select();
    request.then((user) => {
      this.sourceOfResponse = user.source;
      this.editingSource = user.source;
      this.setState({
        user: user,
        playerInfo: { name: "You", ai: user.source, color: '#866' },
        enemyInfo: { name: "Enemy", ai: fiddle, color: '#262' }
      });
    });
    this.requests.push(request);
  }

  componentWillUnmount() {
    this.requests.forEach(request => request.abort());
  }

  save(event?: React.FormEvent) {
    let request = User.update({ source: this.editingSource });
    request.then(() => {
      this.showSavedSnackbar();
    });
    this.requests.push(request);
  }

  saveAndFindAgainst() {
    let request = User.update({ source: this.editingSource });
    request.then(() => {
      let context = this.context as any;
      context.router.replace('/');
    });
    this.requests.push(request);
  }

  reload(event?: React.FormEvent) {
    // HACK...
    (this.refs['arena'] as any).onReload();
  }

  showSavedSnackbar() {
    this.setState({ isSavedSnackbarActive: true });
  }

  hideSavedSnackbar() {
    this.setState({ isSavedSnackbarActive: false });
  }

  render() {
    let resource = strings();

    if (this.state.playerInfo !== null) {

      let players: PlayerInfo[] = [
        this.state.playerInfo,
        this.state.enemyInfo
      ];

      return (
        <Grid>
          <Cell col={6}>
            <Card shadow={0} style={{ width: '100%', marginBottom: '8px', minHeight: '53px' }}>
              <CardTitle>
                <Button raised ripple colored onClick={this.save.bind(this) }><Icon name="save" /> {resource.save}</Button>
                <Spacer />
                <Button raised ripple colored onClick={this.saveAndFindAgainst.bind(this) } style={{ marginLeft: '8px' }}><Icon name="whatshot" /> {resource.save_and_find_against}</Button>
                <Button raised ripple colored onClick={this.reload.bind(this) } style={{ marginLeft: '8px' }}><Icon name="play_arrow" /> {resource.test}</Button>
              </CardTitle>
            </Card>
            <AceEditor code={this.sourceOfResponse} onChange={this.onTextChange} onSave={this.save.bind(this) } className="mdl-shadow--2dp" />
            <Snackbar active={this.state.isSavedSnackbarActive} onTimeout={this.hideSavedSnackbar.bind(this) }>{resource.saved}</Snackbar>
          </Cell>
          <Cell col={6}>
            <BotSelector selected={fiddle} onSelect={this.selectBot} />
            <Arena players={players} ref="arena" />
          </Cell>
        </Grid >
      );
    }

    return (<div>{resource.loading}</div>);
  }
}
