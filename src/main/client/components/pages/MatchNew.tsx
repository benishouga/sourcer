import dialogPolyfill from 'dialog-polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Dialog, DialogTitle, DialogContent, ProgressBar } from 'react-mdl';

import { strings } from '../resources/Strings';
import { useUser } from '../hooks/api-hooks';
import Match from '../../service/Match';
import { RouteParams } from '../routes';
import ProfileCard from '../parts/ProfileCard';

export default function MatchNew(props: RouteComponentProps<RouteParams>) {
  const dialogRef = React.useRef<Dialog>(null);

  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [redirectTo, setRedirectTo] = React.useState<string | null>(null);

  const user = useUser();
  const against = useUser(props.match.params.account);

  React.useEffect(() => {
    if (dialogRef.current) {
      const dialog = ReactDOM.findDOMNode(dialogRef.current) as any;
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
    }
  }, []);

  async function handleOpenDialog() {
    const param = props.match.params.account;
    if (!param) {
      console.log(`against: ${param}`);
      return;
    }
    setOpenDialog(true);
    const match = await Match.create({ against: param });
    setRedirectTo(`/match/${match._id}`);
  }

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  const resource = strings();

  return (
    <div>
      <Grid>
        <Cell col={12}>
          <Link to="/">{resource.returnTop}</Link>
        </Cell>
      </Grid>
      <Grid>
        <Cell col={5}>{user ? <ProfileCard user={user} /> : <span>{resource.loading}</span>}</Cell>
        <Cell col={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
          <div style={{ height: '120px' }} />
          <Button colored onClick={handleOpenDialog} raised ripple>
            {resource.fight}
          </Button>
          <Dialog ref={dialogRef} open={openDialog}>
            <DialogTitle>{resource.fighting}</DialogTitle>
            <DialogContent>
              <ProgressBar indeterminate />
            </DialogContent>
          </Dialog>
        </Cell>
        <Cell col={5}>{against ? <ProfileCard user={against} /> : <span>{resource.loading}</span>}</Cell>
      </Grid>
    </div>
  );
}
