import 'corner_prediction.dart';

class PredictionEngine {
  static CornerPrediction predictCorners({
    required double homeLastAvg,
    required double awayLastAvg,
    required double homeSeasonAvg,
    required double awaySeasonAvg,
    required double leagueAvg,
  }) {
    final predicted =
        (homeLastAvg * 0.35) +
        (awayLastAvg * 0.35) +
        (homeSeasonAvg * 0.15) +
        (awaySeasonAvg * 0.15);

    final safePredicted =
        predicted > 0 ? predicted : leagueAvg;

    final avgLast = (homeLastAvg + awayLastAvg) / 2;
    final variance =
        (homeLastAvg - awayLastAvg).abs();

    double confidence =
        1 - (variance / (avgLast == 0 ? 1 : avgLast));

    confidence = confidence.clamp(0.55, 0.9);

    String bet = 'NO BET';

    if (safePredicted >= 10.5 && confidence >= 0.65) {
      bet = 'OVER 9.5';
    } else if (safePredicted <= 8.0 && confidence >= 0.65) {
      bet = 'UNDER 9.5';
    }

    return CornerPrediction(
      predicted: safePredicted,
      confidence: confidence,
      bet: bet,
    );
  }
}
