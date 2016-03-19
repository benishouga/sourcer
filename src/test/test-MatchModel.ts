import assert from 'power-assert';
import * as mongoose from 'mongoose';
let mockgoose = require('mockgoose');
mockgoose(mongoose);

require('../main/db');

import User, {UserDocument} from '../main/models/User'; assert.ok(User); // import文が最適化により省略されないように
import Match from '../main/models/Match'; assert.ok(Match); // import文が最適化により省略されないように

describe('Match', () => {
  let user: UserDocument = null;
  beforeEach(done => {
    mockgoose.reset();
    user = new User();
    user.account = 'account';
    user.provider = { service: 'twitter', account: '1234' };
    user.save(done);
  });

  it('find', done => {
    new Promise<{}>((resolve, reject) => {
      let match = new Match();
      match.winner = user;
      match.contestants = [user];
      match.save((err, res) => {
        if (!err) { return reject(); }
        assert.ok(!err, 'err');
        resolve();
      });
    }).then(() => {
      User.loadWithMatchees('account').then(() => { done(); });
    }, done);
  });
});
