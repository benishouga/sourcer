import * as assert from 'assert';
import Utils from '../main/core/Utils';
import V from '../main/core/V';
import { arena } from '../main/server/Arena';
import * as fs from 'fs';

describe('NodeArena', () => {
  it('arena', function () {
    this.timeout(15000);

    const startTime = new Date().getTime();
    return arena([
      { account: 'player1', name: 'player1', color: '#f00', ai: fs.readFileSync('samples/standard.js', 'utf-8') },
      { account: 'player2', name: 'player2', color: '#0f0', ai: fs.readFileSync('samples/fiddle.js', 'utf-8') }
    ]).then((matchResult) => {
      if (matchResult.result) {
        assert.equal(matchResult.result.isDraw, false);
        assert.equal(matchResult.result.timeout, null);
        if (matchResult.result.winnerId !== null) {
          assert.equal(matchResult.players[matchResult.result.winnerId].account, 'player1');
        } else {
          assert.ok(false);
        }
      }
    });
  });

  it('infinite loop1', function () {
    this.timeout(15000);

    const code = `
      while(true);
      return ai;
    `;

    const standardAi = fs.readFileSync('samples/standard.js', 'utf-8');
    const startTime = new Date().getTime();
    return arena([
      { account: 'player1', name: 'player1', color: '#f00', ai: standardAi },
      { account: 'player2', name: 'player2', color: '#0f0', ai: code }
    ]).then((matchResult) => {
      if (matchResult.result) {
        assert.equal(matchResult.result.isDraw, false);
        assert.equal(matchResult.result.timeout, 'player2');
        if (matchResult.result.winnerId !== null) {
          assert.equal(matchResult.players[matchResult.result.winnerId].account, 'player1');
        } else {
          assert.ok(false);
        }
      }
    });
  });

  it('infinite loop2', function () {
    this.timeout(15000);

    const code = `
      return function() {
        while(true);
      };
    `;

    const standardAi = fs.readFileSync('samples/standard.js', 'utf-8');
    const startTime = new Date().getTime();
    return arena([
      { account: 'player1', name: 'player1', color: '#f00', ai: code },
      { account: 'player2', name: 'player2', color: '#0f0', ai: standardAi }
    ]).then((matchResult) => {
      if (matchResult.result) {
        assert.equal(matchResult.result.isDraw, false);
        assert.equal(matchResult.result.timeout, 'player1');
        if (matchResult.result.winnerId !== null) {
          assert.equal(matchResult.players[matchResult.result.winnerId].account, 'player2');
        } else {
          assert.ok(false);
        }
      }
    });
  });
});
