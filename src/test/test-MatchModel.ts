import assert from 'power-assert';
import config from '../main/config';
import db from '../main/db';
import * as mongoose from 'mongoose';

import User, {UserDocument} from '../main/models/User'; assert.ok(User); // import文が最適化により省略されないように
import Match from '../main/models/Match'; assert.ok(Match); // import文が最適化により省略されないように

import TestUtils from './TestUtils';

describe('Match', () => {
  let user: UserDocument = null;
  before(function(done) {
    this.timeout(5000);
    db(config.mongodb.test).then(done).catch(done);
  });

  beforeEach(done => {
    user = new User();
    TestUtils.reset(config).then(() => {
      let user = new User();
      user.account = 'account';
      user.provider = {
        service: 'twitter', account: '1234'
      };
      user.save(done);
    });
  });

  it('find', done => {
    new Promise<{}>((resolve, reject) => {
      let match = new Match();
      match.winner = user;
      match.players = [user];
      match.save((err, res) => {
        if (err) { return reject(err); }
        assert.ok(!err, 'err');
        resolve();
      });
    }).then(() => {
      console.log('match save resolved');
      User.loadWithMatchees('account').then((savedUser) => {
        console.log('savedUser ', savedUser);
        done();
      });
    }, done);
  });
});
