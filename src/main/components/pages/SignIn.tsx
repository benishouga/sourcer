import * as React from 'react';
import {Link} from 'react-router';

interface SignInProps extends React.Props<SignIn> {
}

interface SignInStats {
}


export default class SignIn extends React.Component<SignInProps, SignInStats> {
  onChange() {

  }
  render() {
    return (
      <div>
        <h1>Sign In</h1>
        <form>
        </form>
      </div>
    );
  }
}
