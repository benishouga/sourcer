import dialogPolyfill from 'dialog-polyfill';

import React, { useState, useEffect, useRef } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import {
  Grid,
  Cell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  ProgressBar,
  List,
  ListItem,
  ListItemContent,
  Icon
} from 'react-mdl';

import { strings } from '../resources/Strings';
import { UserResponse } from '../../../dts/UserResponse';

import User from '../../service/User';
import Match from '../../service/Match';
import ProfileCard from '../parts/ProfileCard';

const Official: React.FC<RouteComponentProps<{}>> = (props) => {
  const [users, setUsers] = useState<UserResponse[] | undefined>(undefined);
  const [player1, setPlayer1] = useState<UserResponse | undefined>(undefined);
  const [player1Loading, setPlayer1Loading] = useState<boolean>(false);
  const [player2, setPlayer2] = useState<UserResponse | undefined>(undefined);
  const [player2Loading, setPlayer2Loading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);

  const dialogRef = useRef<Dialog | null>(null);

  const handleOpenDialog = async () => {
    setOpenDialog(true);
    if (!player1 || !player2) {
      throw new Error('player not selected');
    }
    if (!player1.account || !player2.account) {
      throw new Error('player account unknown');
    }
    const player1Account = player1.account;
    const player2Account = player2.account;
    const match = await Match.official({ player1: player1Account, player2: player2Account });
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

    const fetchUsers = async () => {
      const signal = abortController.current.signal;
      const users = await User.all({ signal }).catch(error => console.log(error));
      if (users) {
        setUsers(users);
      }
    };

    fetchUsers();

    return () => {
      abortController.current.abort();
    };
  }, []);

  const userList = (callback: (user: UserResponse) => void) => {
    const resource = strings();
    if (!users) {
      return <span>{resource.loading}</span>;
    }
    const lists = users.map(user => {
      return (
        <ListItem key={user.account}>
          <ListItemContent icon="person">
            <a
              onClick={() => {
                callback(user);
              }}
            >
              {user.name}
            </a>
          </ListItemContent>
        </ListItem>
      );
    });

    return <List>{lists}</List>;
  };

  const onSelected = async (user: UserResponse) => {
    const signal = abortController.current.signal;
    return await User.select({ signal, account: user.account }).catch(error => {
      console.log(error);
      return undefined;
    });
  };

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  const resource = strings();

  let player1Element: React.ReactElement<any>;
  if (player1Loading) {
    player1Element = <p>{resource.loading}</p>;
  } else if (player1) {
    player1Element = (
      <div>
        <Button
          raised
          ripple
          colored
          onClick={() => {
            setPlayer1(undefined);
          }}
        >
          <Icon name="cancel" /> {resource.reselect}
        </Button>
        <ProfileCard user={player1} />
      </div>
    );
  } else {
    player1Element = userList(user => {
      setPlayer1(undefined);
      setPlayer1Loading(true);
      onSelected(user).then(filledUser => {
        setPlayer1(filledUser);
        setPlayer1Loading(false);
      });
    });
  }

  let player2Element: React.ReactElement<any>;
  if (player2Loading) {
    player2Element = <p>{resource.loading}</p>;
  } else if (player2) {
    player2Element = (
      <div>
        <Button
          raised
          ripple
          colored
          onClick={() => {
            setPlayer2(undefined);
          }}
        >
          <Icon name="cancel" /> {resource.reselect}
        </Button>
        <ProfileCard user={player2} />
      </div>
    );
  } else {
    player2Element = userList(user => {
      setPlayer2(undefined);
      setPlayer2Loading(true);
      onSelected(user).then(filledUser => {
        setPlayer2(filledUser);
        setPlayer2Loading(false);
      });
    });
  }

  return (
    <Grid>
      <Cell col={5}>{player1Element}</Cell>
      <Cell col={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <div style={{ height: '120px' }} />
        <Button
          colored
          onClick={handleOpenDialog}
          raised
          ripple
          disabled={!player1 || !player2}
        >
          {resource.fight}
        </Button>
        <Dialog
          open={openDialog}
          ref={dialogRef}
        >
          <DialogTitle>{resource.fighting}</DialogTitle>
          <DialogContent>
            <ProgressBar indeterminate />
          </DialogContent>
        </Dialog>
      </Cell>
      <Cell col={5}>{player2Element}</Cell>
    </Grid>
  );
};

export default Official;
