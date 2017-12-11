import * as assert from 'assert';
import Utils from '../main/core/Utils';
import V from '../main/core/V';
import { arena } from '../main/server/Arena';
import * as fs from 'fs';

describe('NodeArena', () => {
  it('arena', function() {
    this.timeout(15000);

    const startTime = new Date().getTime();
    return arena([
      { account: 'player1', name: 'player1', color: '#f00', source: fs.readFileSync('samples/standard.js', 'utf-8') },
      { account: 'player2', name: 'player2', color: '#0f0', source: fs.readFileSync('samples/fiddle.js', 'utf-8') }
    ]).then(matchResult => {
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

  it('infinite loop1', function() {
    this.timeout(15000);

    const code = `
      while(true);
    `;

    const standardBot = fs.readFileSync('samples/standard.js', 'utf-8');
    const startTime = new Date().getTime();
    return arena([
      { account: 'player1', name: 'player1', color: '#f00', source: standardBot },
      { account: 'player2', name: 'player2', color: '#0f0', source: code }
    ]).then(matchResult => {
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

  it('infinite loop2', function() {
    this.timeout(15000);

    const code = `
      return function() {
        while(true);
      };
    `;

    const standardBot = fs.readFileSync('samples/standard.js', 'utf-8');
    const startTime = new Date().getTime();
    return arena([
      { account: 'player1', name: 'player1', color: '#f00', source: code },
      { account: 'player2', name: 'player2', color: '#0f0', source: standardBot }
    ]).then(matchResult => {
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
