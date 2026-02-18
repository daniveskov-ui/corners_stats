import 'dart:math';

class QuantBet {

  final double probability;
  final double odds;
  final double bankroll;

  late double ev;
  late double kelly;
  late double stake;

  QuantBet({
    required this.probability,
    required this.odds,
    required this.bankroll,
  }) {
    ev = calculateEV();
    kelly = calculateKelly();
    stake = calculateStake();
  }

  double calculateEV() {
    return (probability * odds) - 1;
  }

  double calculateKelly() {

    double edge = ev;
    double k = edge / (odds - 1);

    if (k <= 0) return 0;

    return k;
  }

  double calculateStake() {

    double fraction = kelly * 0.25; // safer Kelly

    return bankroll * fraction;
  }

}

class QuantPortfolio {

  final double bankroll;

  QuantPortfolio(this.bankroll);

  List<QuantBet> allocate(List<double> probabilities) {

    List<QuantBet> bets = [];

    for (var p in probabilities) {

      final bet = QuantBet(
        probability: p,
        odds: 1.90,
        bankroll: bankroll,
      );

      if (bet.ev > 0)
        bets.add(bet);

    }

    return bets;
  }

  double expectedGrowth(List<QuantBet> bets) {

    double totalEV = 0;

    for (var b in bets) {
      totalEV += b.ev * b.stake;
    }

    return totalEV;
  }

  double riskOfRuin(List<QuantBet> bets) {

    if (bets.isEmpty)
      return 0;

    double lossRate =
        bets.where((b) => b.ev < 0).length /
        bets.length;

    return pow(lossRate, 5).toDouble();
  }

}
