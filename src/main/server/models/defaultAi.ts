export const defaultAi = `// **** ミサイル用のAIを定義 ****
var missileAi = function(controller) {

  // 相手が左側にいるか判定する
  // （左90度の角度から、180度の範囲に敵が存在するか判定）
  if(controller.scanEnemy(90, 180)) {
    controller.turnLeft(); // 左へ回転
  } else { // 左側にいない場合
    controller.turnRight(); // 右へ回転
  }

  // 今向いている方向へ、加速する
  controller.speedUp();
};

// **** 本体用のAIを定義 ****
var ai = function(controller) {
  // 前方からの攻撃を避ける
  // （敵の攻撃が 前方0度 の角度から 60度の範囲、距離60 以内にあるか判定）
  if (controller.scanAttack(0, 60, 60)) {
    controller.descent(); // 高度を下げる
    return;
  }

  // 地面にぶつからないように自機の高度が高さ 100 以下になっていた場合
  if (controller.altitude() < 100) {
    controller.ascent(); // 高度を上げる
    return;
  }

  // 敵が後方に居た場合 (前方180度内に居なかった場合)
  if (!controller.scanEnemy(0, 180)) {
    controller.turn(); // 現在向いている方向と逆方向を向く
    return;
  }

  // 敵が前方近くに居た場合
  // （向き 0度、90度, 距離 200の範囲内に存在していた場合）
  if (controller.scanEnemy(0, 90, 200)) {
    // 機体の温度が高い場合は、攻撃しない
    if (80 < controller.temperature()) {
      return;
    }

    // 5フレームに一度、ミサイルを発射する
    if (controller.frame() % 5 === 0) {
      // 先に定義済みの、ミサイル用AIを使用し、ミサイルを発射する
      controller.fireMissile(missileAi);
    } else {
      // 前方（0度）へ向けて 強さ8で アサルト弾を発射する
      controller.fireLaser(0, 8);
    }
    return;
  }
  // 近くにいなければ前進する
  controller.ahead();
};
return ai;`;
