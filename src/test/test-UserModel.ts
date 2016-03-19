import assert from 'power-assert';
import * as mongoose from 'mongoose';
let mockgoose = require('mockgoose');
mockgoose(mongoose);

require('../main/db');

import User, {UserDocument} from '../main/models/User'; assert.ok(User); // import文が最適化により省略されないように
import Match from '../main/models/Match'; assert.ok(Match); // import文が最適化により省略されないように

describe('User', () => {
  let user: UserDocument = null;

  beforeEach(done => {
    mockgoose.reset();
    user = new User();
    user.account = 'account';
    user.provider = { service: 'twitter', account: '1234' };
    user.save(done);
  });

  it('findByOAuthAccount', done => {
    User.findByOAuthAccount({ service: 'twitter', account: '1234' }).then((user1) => {
      assert.ok(user.account === 'account', 'account');
      assert.ok(user.provider.service === 'twitter', 'oauthProvider');
      assert.ok(user.provider.account === '1234', 'oauthAccount');
      done();
    }, done);
  });

  it('loadByAccount', done => {
    User.loadByAccount('account').then((user) => {
      assert.ok(user.account === 'account', 'account');
      assert.ok(user.provider.service === 'twitter', 'oauthProvider');
      assert.ok(user.provider.account === '1234', 'oauthAccount');
      done();
    }, done);
  });

  it('loadWithMatchees', done => {
    let match = new Match();
    match.winner = user;
    match.contestants = [user];
    Match.createAndRegisterToUser(match, (err, result) => {
      if (err) { done(err); }

      User.loadWithMatchees('account').then((user) => {
        assert.ok(user.matches.length === 1, 'matches');
        assert.ok(user.matches[0].winner.account === 'account', 'winner account');
        assert.ok(user.matches[0].contestants.length === 1, 'contestants');
        assert.ok(user.matches[0].contestants[0].account === 'account', 'contestants');
        done();
      }, done);
    });
  });
});
