import Utils from '../main/core/Utils';
import V from '../main/core/V';
import assert from 'power-assert';
import {arena} from '../main/arena/nodeArena';
import * as fs from 'fs';

describe('NodeArena', function() {

  it('arena', function(done) {
    this.timeout(15000);

    let standardAi = fs.readFileSync('samples/standard.js', 'utf-8');
    let startTime = new Date().getTime();
    arena([
      { account: 'player1', name: 'player1', color: '#f00', ai: standardAi },
      { account: 'player2', name: 'player2', color: '#0f0', ai: standardAi }
    ]).then((matchResult) => {
      console.log(matchResult.frames[1000]);
      console.log(new Date().getTime() - startTime, ' ms');
      done();
    });
  });
});
