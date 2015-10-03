import * as assert from 'power-assert';
import * as mongoose from 'mongoose';
let mockgoose = require('mockgoose');
mockgoose(mongoose);

require('../main/db');

import User, {UserDocument} from '../main/models/User'; assert.ok(User); // import文が最適化により省略されないように
import Ai from '../main/models/Ai'; assert.ok(Ai); // import文が最適化により省略されないように
import Match from '../main/models/Match'; assert.ok(Match); // import文が最適化により省略されないように

describe('Ai', () => {
  let user: UserDocument = null;
  beforeEach(done => {
    mockgoose.reset();

    user = new User({
      account: 'account',
      providers: [{ provider: 'twitter', account: '1234' }]
    });
    user.save(done);
  });

  it('updateOrCreate', done => {
    let ai = new Ai({ owner: user._id, name: 'hoge', source: 'huga' });
    Ai.updateOrCreate(ai, (err, res) => {
      assert.ok(!err, 'err');
      assert.ok('hoge' === res.name, 'create Ai name');
      assert.ok('huga' === res.source, 'create Ai source');

      ai.name = 'newHoge';
      ai.source = 'newHuga';

      User.loadByAccount('account', (err, res) => {
        assert.ok(!err, 'err');
        assert.ok(res.ais.length === 1, 'ais');
        assert.ok(res.ais[0].name === 'hoge', 'ai name');
        assert.ok(res.ais[0].source === 'huga', 'ai source');

        Ai.updateOrCreate(ai, (err, res) => {
          assert.ok(!err, 'err');
          assert.ok('newHoge' === res.name, 'update Ai name');
          assert.ok('newHuga' === res.source, 'update Ai source');
          done();
        });
      });
    });
  });

  it('loadWithMatchees', done => {
    let ai = new Ai({ owner: user._id, name: 'hoge', source: 'huga' });
    Ai.updateOrCreate(ai, (err, res) => {
      assert.ok(!err, 'err');
      let match = new Match({
        winner: { owner: user, ai: ai }, timeout: false, path: 'path'
      });
      match.contestants.push({ owner: user, ai: ai });
      Match.createAndRegisterToAi(
        match,
        (err, res) => {
          Ai.loadWithMatchees(ai.owner, ai.name, (err, res) => {
            assert.ok(!err, 'err');
            assert.ok(res.matches.length === 1, 'matches');
            assert.ok(res.matches[0].winner.owner.account === 'account', 'winner account');
            assert.ok(res.matches[0].contestants.length === 1, 'contestants');
            assert.ok(res.matches[0].contestants[0].ai.name === 'hoge', 'ai name');
            done();
          });
        }
      );
    });
  });

});
