export const standard = `
// **** ミサイル用のAIを定義 ****
var missileAi = function(controller) {
  // 相手が左側にいるか判定する
  // （左90度の角度から、180度の範囲、距離10000以内に敵が存在するか判定）
  if (controller.scanEnemy(90, 180)) {
    // 左側にいる場合は、左へ回転
    controller.turnLeft();
  } else {
    // それ以外は、右へ回転
    controller.turnRight();
  }
  // 今向いている方向へ、加速する
  controller.speedUp();
};

// **** 本体用のAIを定義 ****
var ai = function(controller) {
  // 前方からの攻撃を避ける
  // （相手の攻撃が 前方0度 の角度から 60度の範囲、距離60 以内にあるか判定）
  if (controller.scanAttack(0, 60, 60)) {
    // 後退しながら、高度を下げる
    controller.back();
    controller.descent();
    return;
  }

  // 自機の高度が高さ 100 以下になっていた場合
  if (controller.altitude() < 100) {
    // 高度を上げる
    controller.ascent();
    return;
  }

  // 敵が後方に居た場合 (前方180度内に居なかった場合)
  if (!controller.scanEnemy(0, 180)) {
    // 現在向いている方向と逆方向を向く
    controller.turn();
    return;
  }

  // 敵が前方近くに居た場合、攻撃する
  // 向き 0度、100度, 距離 200の範囲内に存在していた場合、攻撃する
  if (controller.scanEnemy(0, 100, 200)) {
    // 機体の温度が高い場合は、攻撃しない
    if (80 < controller.temperature()) {
      return;
    }
    // 5フレームに一度、ミサイルを発射する
    if (controller.frame() % 5 === 0) {
      // 先に定義済みの、ミサイル用AIを使用し、ミサイルを発射する
      controller.fireMissile(missileAi);
    } else {
      // 敵が居る方へ攻撃
      if (controller.scanEnemy(0, 20)) {
        controller.fireLaser(0, 100);
      } else if (controller.scanEnemy(30, 40)) {
        controller.fireLaser(30, 100);
      } else if (controller.scanEnemy(-30, 40)) {
        controller.fireLaser(-30, 100);
      }
    }
    return;
  }
  // 敵が前方すぐ近くに居た場合、後退する
  if (controller.scanEnemy(0, 180, 60)) {
      controller.back();
      return;
  }
  // 敵が前方の遠い位置に居た場合、前進する
  if (controller.scanEnemy(0, 30)) {
      controller.ahead();
      return;
  }
  // 敵が自分より下方向に居た場合、下降する
  if (controller.scanEnemy(-45, 90)) {
      controller.descent();
      return;
  }
  // 敵が自分より上方向に居た場合、上昇する
  controller.ascent();
  return;
};
return ai;
`;
