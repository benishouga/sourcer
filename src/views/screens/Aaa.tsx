import * as React from 'react';
import Data from '../models/data';
import AppProps from '../models/app';

export default class Aaa extends React.Component<AppProps, {}> {
  render() {
    var datas = this.props.datas["aaa"].map(data => {
      return (
        <p key={data.id}>{data.id}: {data.title}</p>
      );
    });
    return (
      <div>{datas}</div>
    );
  }
}
