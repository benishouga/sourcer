import dialogPolyfill from 'dialog-polyfill';

import React, { useState, useEffect, useRef } from 'react';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import { Grid, Cell, Button, Dialog, DialogTitle, DialogContent, ProgressBar } from 'react-mdl';

import { strings } from '../resources/Strings';
import { UserResponse } from '../../../dts/UserResponse';

import User from '../../service/User';
import Match from '../../service/Match';
import { RouteParams } from '../routes';
import ProfileCard from '../parts/ProfileCard';

const MatchNew: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [user, setUser] = useState<UserResponse | undefined>(undefined);
  const [against, setAgainst] = useState<UserResponse | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);

  const dialogRef = useRef<Dialog | null>(null);

  const handleOpenDialog = async () => {
    const against = props.match.params.account;
    if (!against) {
      console.log(`against: ${against}`);
      return;
    }

    setOpenDialog(true);
    const match = await Match.create({ against });
    setRedirectTo(`/match/${match._id}`);
  };

  const abortController = useRef<AbortController>(new AbortController());

  useEffect(() => {
    if (dialogRef.current) {
      const dialog = ReactDOM.findDOMNode(dialogRef.current) as any;
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
    }

    const signal = abortController.current.signal;

    // process in parallel...
    (async () => {
      const user = await User.select({ signal }).catch(error => console.log(error));
      if (user) {
        setUser(user);
      }
    })();

    (async () => {
      const account = props.match.params.account;
      const against = await User.select({ signal, account }).catch(error => console.log(error));
      if (against) {
        setAgainst(against);
      }
    })();

    return () => {
      abortController.current.abort();
    };
  }, [props.match.params.account]);

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  const resource = strings();

  let userCard: React.ReactElement<any>;
  if (user) {
    userCard = <ProfileCard user={user} />;
  } else {
    userCard = <span>{resource.loading}</span>;
  }

  let againstCard: React.ReactElement<any>;
  if (against) {
    againstCard = <ProfileCard user={against} />;
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
          <Button colored onClick={handleOpenDialog} raised ripple>
            {resource.fight}
          </Button>
          <Dialog open={openDialog} ref={dialogRef}>
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
};

export default MatchNew;
