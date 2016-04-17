import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router';
import AceEditor from '../parts/AceEditor';
import {Grid, Cell, Button, Card, CardTitle, CardText, Dialog, DialogTitle, DialogContent, ProgressBar} from 'react-mdl';
import User, {UserModel} from '../../service/User';
import Match, {MatchModel} from '../../service/Match';
import {RouteParams} from '../routes';

interface MatchNewProps extends RouteComponentProps<RouteParams, {}> {
}

interface MatchNewStats {
  user?: UserModel;
  against?: UserModel;
  openDialog?: boolean;
}


export default class MatchNew extends React.Component<MatchNewProps, MatchNewStats> {
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object
  };

  constructor() {
    super();
    this.state = {};
  }

  handleOpenDialog() {
    this.setState({
      openDialog: true
    });
    Match.create(this.props.params.userId).then((match: MatchModel) => {
      let context = this.context as any;
      context.router.replace(`/match/${match._id}`);
    });
  }

  componentDidMount() {
    User.select().then((user) => {
      this.setState({
        user: user
      });
    });
    User.select(this.props.params.userId).then((user) => {
      this.setState({
        against: user
      });
    });
  }

  render() {

    let userCard: React.ReactElement<any>;
    if (this.state.user) {
      userCard = (
        <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            You
          </CardTitle>
          <CardText>
            <AceEditor code={this.state.user.source} readOnly={true} />
          </CardText>
        </Card>
      );
    } else {
      userCard = (<span>Loading...</span>);
    }

    let againstCard: React.ReactElement<any>;
    if (this.state.against) {
      againstCard = (
        <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
          <CardTitle expand style={{ alignItems: 'flex-start' }}>
            {this.state.against.account}
          </CardTitle>
          <CardText>
            <AceEditor code={this.state.against.source} readOnly={true} />
          </CardText>
        </Card>
      );
    } else {
      againstCard = (<span>Loading...</span>);
    }

    return (
      <Grid>
        <Cell col={5}>
          {userCard}
        </Cell>
        <Cell col={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
          <div style={{ height: '120px' }}></div>
          <Button colored onClick={this.handleOpenDialog.bind(this) } raised ripple>FIGHT</Button>
          <Dialog open={this.state.openDialog}>
            <DialogTitle>Fighting...</DialogTitle>
            <DialogContent>
              <ProgressBar indeterminate />
            </DialogContent>
          </Dialog>
        </Cell>
        <Cell col={5}>
          {againstCard}
        </Cell>
      </Grid>
    );
  }
}
