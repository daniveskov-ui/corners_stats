class Bet {
  final DateTime date;
  final String market;
  final double odds;
  final double stake;
  final bool? win; // null = pending

  Bet({
    required this.date,
    required this.market,
    required this.odds,
    required this.stake,
    this.win,
  });

  Bet copyWith({bool? win}) {
    return Bet(
      date: date,
      market: market,
      odds: odds,
      stake: stake,
      win: win,
    );
  }
}
