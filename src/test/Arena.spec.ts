import * as assert from 'assert';
import { arena } from '../main/server/Arena';

const botSource = `var missile = function(ctrl) {
  if(ctrl.scanEnemy(90, 180)) {
    ctrl.turnLeft();
  } else {
    ctrl.turnRight();
  }
  ctrl.speedUp();
};
return function(ctrl) {
  if (ctrl.scanAttack(0, 60, 60)) {
    ctrl.back();
    ctrl.descent();
    return;
  }
  if (ctrl.altitude() < 100) {
    ctrl.ascent();
    return;
  }
  if (!ctrl.scanEnemy(0, 180)) {
    ctrl.turn();
    return;
  }
  if (ctrl.scanEnemy(0, 30, 200)) {
    if (80 < ctrl.temperature()) {
      return;
    }
    if (ctrl.frame() % 5 === 0) {
      ctrl.fireMissile(missile);
    } else {
      ctrl.fireLaser(0, 8);
    }
    return;
  }
  if (ctrl.scanEnemy(0, 30)) {
    ctrl.ahead();
    return;
  }
};`;

const fiddleSource = `return function(ctrl) { if(ctrl.altitude() < 100) { ctrl.ascent(); } }`;

describe('NodeArena', () => {
  it('arena', function() {
    this.timeout(15000);

    return arena([
      { account: 'player1', name: 'player1', color: '#f00', source: botSource },
      { account: 'player2', name: 'player2', color: '#0f0', source: fiddleSource }
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

    return arena([
      { account: 'player1', name: 'player1', color: '#f00', source: botSource },
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

    return arena([
      { account: 'player1', name: 'player1', color: '#f00', source: code },
      { account: 'player2', name: 'player2', color: '#0f0', source: botSource }
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
