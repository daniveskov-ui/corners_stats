class CornersPrediction {
  final double homeAvg;
  final double awayAvg;
  final double leagueAvg;
  final double predicted;
  final double confidence;

  CornersPrediction({
    required this.homeAvg,
    required this.awayAvg,
    required this.leagueAvg,
    required this.predicted,
    required this.confidence,
  });
}

class CornersEngine {
  static CornersPrediction predict({
    required double homeAvg,
    required double awayAvg,
    required double leagueAvg,
  }) {
    // Weighted model
    final predicted =
        (homeAvg * 0.45) + (awayAvg * 0.35) + (leagueAvg * 0.20);

    // Confidence based on deviation
    final deviation = (predicted - leagueAvg).abs();
    final confidence = (1 - (deviation / leagueAvg)).clamp(0.55, 0.95);

    return CornersPrediction(
      homeAvg: homeAvg,
      awayAvg: awayAvg,
      leagueAvg: leagueAvg,
      predicted: predicted,
      confidence: confidence,
    );
  }

  static bool isOver(double predicted, double line) {
    return predicted > line;
  }

  static double probability(double predicted, double line) {
    final diff = (predicted - line).abs();
    final base = 0.55;
    final boost = (diff / line).clamp(0, 0.35);
    return (base + boost).clamp(0.55, 0.90);
  }
}
