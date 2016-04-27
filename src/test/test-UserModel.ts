import assert from 'power-assert';
import config from '../main/config';
import db from '../main/db';
import * as mongoose from 'mongoose';

import User, {UserDocument} from '../main/models/User'; assert.ok(User); // import文が最適化により省略されないように
import Match from '../main/models/Match'; assert.ok(Match); // import文が最適化により省略されないように

import TestUtils from './TestUtils';

describe('User', () => {
  let user: UserDocument = null;
  before(function(done) {
    this.timeout(5000);
    db(config.mongodb.test).then(done).catch(done);
  });

  beforeEach(done => {
    TestUtils.reset(config).then(() => {
      user = new User();
      user.account = 'account';
      user.provider = {
        service: 'twitter', account: '1234'
      };
      user.save(() => {
        done();
      });
    });
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

  it.only('loadWithMatchees', function(done) {
    this.timeout(10000);
    let match = new Match();
    match.winner = user;
    match.contestants = [user];
    Match.createAndRegisterToUser(match).then((match) => {
      return User.loadWithMatchees('account').then((user) => {
        assert.ok(user.matches.length === 1, 'matches');
        assert.ok(user.matches[0].winner.account === 'account', 'winner account');
        assert.ok(user.matches[0].contestants.length === 1, 'contestants');
        assert.ok(user.matches[0].contestants[0].account === 'account', 'contestants');
      });
    }).then(done).catch(done);
  });
});
