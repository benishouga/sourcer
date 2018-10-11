import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Dialog, DialogTitle, DialogContent, ProgressBar } from 'react-mdl';

import { strings } from '../resources/Strings';
import { UserResponse } from '../../../dts/UserResponse';

import { AbortController } from '../../utils/fetch';
import User from '../../service/User';
import Match from '../../service/Match';
import { RouteParams } from '../routes';
import ProfileCard from '../parts/ProfileCard';

export interface MatchNewState {
  user?: UserResponse;
  against?: UserResponse;
  openDialog?: boolean;
  redirectTo?: string;
}

export default class MatchNew extends React.Component<RouteComponentProps<RouteParams>, MatchNewState> {
  private dialog?: Dialog;

  constructor(props: RouteComponentProps<RouteParams>) {
    super(props);
    this.state = {};
  }

  public async handleOpenDialog() {
    const against = this.props.match.params.account;
    if (!against) {
      console.log(`against: ${against}`);
      return;
    }

    this.setState({
      openDialog: true
    });
    const match = await Match.create({ against });
    this.setState({ redirectTo: `/match/${match._id}` });
  }

  private abortController: AbortController = new AbortController();
  public componentDidMount() {
    if (this.dialog) {
      const dialog = ReactDOM.findDOMNode(this.dialog) as any;
      if (!dialog.showModal) {
        (window as any).dialogPolyfill.registerDialog(dialog);
      }
    }

    const signal = this.abortController.signal;

    // process in parallel...
    (async () => {
      const user = await User.select({ signal }).catch(error => console.log(error));
      if (user) {
        this.setState({ user });
      }
    })();

    (async () => {
      const account = this.props.match.params.account;
      const against = await User.select({ signal, account }).catch(error => console.log(error));
      if (against) {
        this.setState({ against });
      }
    })();
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const resource = strings();

    let userCard: React.ReactElement<any>;
    if (this.state.user) {
      userCard = <ProfileCard user={this.state.user} />;
    } else {
      userCard = <span>{resource.loading}</span>;
    }

    let againstCard: React.ReactElement<any>;
    if (this.state.against) {
      againstCard = <ProfileCard user={this.state.against} />;
    } else {
      againstCard = <span>{resource.loading}</span>;
    }

    return (
      <div>
        <Grid>
          <Cell col={12}>
            <Link to="/">{resource.returnTop}</Link>
          </Cell>
        </Grid>
        <Grid>
          <Cell col={5}>{userCard}</Cell>
          <Cell col={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <div style={{ height: '120px' }} />
            <Button colored onClick={this.handleOpenDialog.bind(this)} raised ripple>
              {resource.fight}
            </Button>
            <Dialog open={this.state.openDialog} ref={(dialog: any) => (this.dialog = dialog)}>
              <DialogTitle>{resource.fighting}</DialogTitle>
              <DialogContent>
                <ProgressBar indeterminate />
              </DialogContent>
            </Dialog>
          </Cell>
          <Cell col={5}>{againstCard}</Cell>
        </Grid>
      </div>
    );
  }
}
