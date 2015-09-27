import * as assert from 'power-assert';
import * as mongoose from 'mongoose';
let mockgoose = require('mockgoose');
mockgoose(mongoose);

let dbURI = 'mongodb://localhost/todo';
mongoose.connect(dbURI);
mongoose.connection.on('connected', () => console.log('Mongoose> connected: ' + dbURI));
mongoose.connection.on('error', (err: any) => console.log('Mongoose> error: ' + err));
mongoose.connection.on('disconnected', () => console.log('Mongoose> disconnected'));
process.on('SIGINT', () => {
  mongoose.connection.close(function() {
    console.log('Mongoose> SIGINT - terminating...');
    process.exit(0);
  });
});

import Ai from '../main/models/Ai'; console.log(!!Ai);
import User from '../main/models/User'; console.log(!!User);

describe.only('User', () => {
  beforeEach(done => {
    mockgoose.reset();

    new User({
      account: 'account',
      providers: [{ provider: 'twitter', id: '1234' }],
      ais: []
    }).save(done);
  });

  it('find', done => {
    User.find({}, (err, user) => {
      assert.ok(!err, 'no error');
      assert.ok(user, 'user is not null.');
      assert.ok(user.length === 1, 'user length is 1.');
      console.log(user);
      done();
    });
  });

  it('findByAccount', done => {
    User.findByAccount({ provider: 'twitter', id: '1234' }).then((user) => {
      console.log(user);
      done();
    });
  });
});
