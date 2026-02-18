class Prediction {
  final double homeAvg;
  final double awayAvg;
  final double leagueAvg;
  final double predicted;
  final double line;
  final double confidence;
  final bool value;
  final String bet;

  Prediction({
    required this.homeAvg,
    required this.awayAvg,
    required this.leagueAvg,
    required this.predicted,
    required this.line,
    required this.confidence,
    required this.value,
    required this.bet,
  });

  factory Prediction.fromJson(Map<String, dynamic> json) {
    return Prediction(
      homeAvg: (json['homeAvg'] as num).toDouble(),
      awayAvg: (json['awayAvg'] as num).toDouble(),
      leagueAvg: (json['leagueAvg'] as num).toDouble(),
      predicted: (json['predicted'] as num).toDouble(),
      line: (json['line'] as num).toDouble(),
      confidence: (json['confidence'] as num).toDouble(),
      value: json['value'] as bool,
      bet: json['bet'] as String,
    );
  }
}
