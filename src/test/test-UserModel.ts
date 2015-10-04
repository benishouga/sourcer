import * as assert from 'power-assert';
import * as mongoose from 'mongoose';
let mockgoose = require('mockgoose');
mockgoose(mongoose);

require('../main/db');

import User, {UserDocument} from '../main/models/User'; assert.ok(User); // import文が最適化により省略されないように
import Ai from '../main/models/Ai'; assert.ok(Ai); // import文が最適化により省略されないように
import Match from '../main/models/Match'; assert.ok(Match); // import文が最適化により省略されないように

describe('User', () => {
  let user: UserDocument = null;

  beforeEach(done => {
    mockgoose.reset();

    user = new User({
      account: 'account',
      providers: [{ provider: 'twitter', account: '1234' }]
    });
    user.save(done);
  });

  it('findByOAuthAccount', done => {
    let ai = new Ai({ owner: user._id, name: 'hoge', source: 'huga' });
    Ai.updateOrCreate(ai, (err, res) => {
      if (err) { done(err); }

      User.findByOAuthAccount({ provider: 'twitter', account: '1234' }, (err, user) => {
        if (err) { done(err); }

        assert.ok(user.account === 'account', 'account');
        assert.ok(user.providers.length === 1, 'providers');
        assert.ok(user.providers[0].provider === 'twitter', 'oauthProvider');
        assert.ok(user.providers[0].account === '1234', 'oauthAccount');
        assert.ok(user.ais.length === 1, 'ais');
        done();
      });
    });
  });

  it('loadByAccount', done => {
    let ai = new Ai({ owner: user._id, name: 'hoge', source: 'huga' });
    Ai.updateOrCreate(ai, (err, res) => {
      if (err) { done(err); }

      User.loadByAccount('account', (err, user) => {
        if (err) { done(err); }

        assert.ok(user.account === 'account', 'account');
        assert.ok(user.providers.length === 1, 'providers');
        assert.ok(user.providers[0].provider === 'twitter', 'oauthProvider');
        assert.ok(user.providers[0].account === '1234', 'oauthAccount');
        assert.ok(user.ais.length === 1, 'ais');
        assert.ok(user.ais[0].name === 'hoge', 'ai name');
        assert.ok(user.ais[0].source === 'huga', 'ai source');
        done();
      });
    });
  });

});
