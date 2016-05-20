export var fewAttack = `
var current = 150; // 維持する高さを決定するための変数
var ai = function(controller) {
  if (controller.frame() % 32 === 0) {
    // 32 frame に一度 高さを変える
    current = Math.random() * 200 + 50;
  }

  // 敵が後ろに居るなら、ターンする
  if (!controller.scanEnemy(0, 180)) {
    controller.turn();
    return;
  }

  // current より低い位置に居たら上昇する
  if (controller.altitude() < current) {
    controller.ascent();
  }

  // 8 frame に一度 前進する
  if (controller.frame() % 8 === 0) {
    controller.ahead();
  }

  // 10 frame に一度 攻撃する
  if (controller.frame() % 10 === 0) {
    // 温度が低い場合だけ攻撃する
    if (controller.temperature() < 80) {

      // 前方に敵がいれば前方に攻撃する
      if (controller.scanEnemy(0, 20)) {
        controller.fireLaser(0, 100);

      // 少し上に居るなら、少し上に攻撃する
      } else if (controller.scanEnemy(30, 40)) {
        controller.fireLaser(30, 100);

      // 少し下に居るなら、少し下に攻撃する
      } else if (controller.scanEnemy(-30, 40)) {
        controller.fireLaser(-30, 100);
      }
    }
  }
};
return ai;
`;
