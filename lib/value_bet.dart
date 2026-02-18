class ValueBetResult {
  final double probability;
  final double edge;
  final double kelly;
  final bool isValue;

  ValueBetResult({
    required this.probability,
    required this.edge,
    required this.kelly,
    required this.isValue,
  });

  static ValueBetResult calculate({
    required double confidence,
    required double odds,
  }) {
    final probability = confidence;
    final edge = (probability * odds) - 1;
    final kelly = edge / (odds - 1);

    return ValueBetResult(
      probability: probability,
      edge: edge,
      kelly: kelly > 0 ? kelly : 0,
      isValue: edge > 0,
    );
  }
}
