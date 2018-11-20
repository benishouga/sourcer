import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Dialog, DialogTitle, DialogContent, ProgressBar } from 'react-mdl';

import { UserResponse } from '../../../dts/UserResponse';
import { strings } from '../resources/Strings';
import { useAllUser } from '../hooks/api-hooks';

import Match from '../../service/Match';
import UserSelector from '../parts/UserSelector';

export default function Official() {
  const [player1, setPlayer1] = React.useState<UserResponse | null>(null);
  const [player2, setPlayer2] = React.useState<UserResponse | null>(null);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [redirectTo, setRedirectTo] = React.useState<string | null>(null);

  const dialogRef = React.useRef<Dialog>(null);

  const users = useAllUser();

  async function handleOpenDialog() {
    setOpenDialog(true);
    if (!player1 || !player2) {
      throw new Error('player not selected');
    }
    if (!player1.account || !player2.account) {
      throw new Error('player account unknown');
    }
    const player1Id = player1.account;
    const player2Id = player2.account;
    const match = await Match.official({ player1: player1Id, player2: player2Id });
    setRedirectTo(`/match/${match._id}`);
  }

  React.useEffect(() => {
    if (dialogRef.current) {
      const dialog = ReactDOM.findDOMNode(dialogRef.current) as any;
      if (!dialog.showModal) {
        (window as any).dialogPolyfill.registerDialog(dialog);
      }
    }
  }, []);

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  const resource = strings();

  return (
    <Grid>
      <Cell col={5}>
        <UserSelector users={users} onSelectUser={user => setPlayer1(user)} />
      </Cell>
      <Cell col={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <div style={{ height: '120px' }} />
        <Button colored onClick={handleOpenDialog} raised ripple disabled={!player1 || !player2}>
          {resource.fight}
        </Button>
        <Dialog ref={dialogRef} open={openDialog}>
          <DialogTitle>{resource.fighting}</DialogTitle>
          <DialogContent>
            <ProgressBar indeterminate />
          </DialogContent>
        </Dialog>
      </Cell>
      <Cell col={5}>
        <UserSelector users={users} onSelectUser={user => setPlayer2(user)} />
      </Cell>
    </Grid>
  );
}
