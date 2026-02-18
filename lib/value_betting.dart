class ValueBetResult {
  final bool isValue;
  final double modelProbability;
  final double impliedProbability;
  final double edge;

  ValueBetResult({
    required this.isValue,
    required this.modelProbability,
    required this.impliedProbability,
    required this.edge,
  });
}

class ValueBetting {
  /// odds = bookmaker odds (ex: 1.90)
  /// confidence = model confidence (0–1)
  static ValueBetResult check({
    required double odds,
    required double confidence,
  }) {
    final implied = 1 / odds;
    final edge = confidence - implied;

    return ValueBetResult(
      isValue: edge > 0.05, // 🔥 5% edge filter
      modelProbability: confidence,
      impliedProbability: implied,
      edge: edge,
    );
  }
}
