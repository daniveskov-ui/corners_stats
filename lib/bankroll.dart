class Bankroll {
  static double current = 1000;

  static void applyResult({
    required double stake,
    required bool win,
    required double odds,
  }) {
    if (win) {
      current += stake * (odds - 1);
    } else {
      current -= stake;
    }
  }
}
