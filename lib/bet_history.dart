import 'bet.dart';
import 'bankroll.dart';

class BetHistory {
  static final List<Bet> _bets = [];

  static List<Bet> get bets => _bets;

  static void addBet(Bet bet) {
    _bets.insert(0, bet);
  }

  static void settleBet(int index, bool win) {
    final bet = _bets[index];
    if (bet.win != null) return;

    if (win) {
      Bankroll.current += bet.stake * (bet.odds - 1);
    } else {
      Bankroll.current -= bet.stake;
    }

    _bets[index] = bet.copyWith(win: win);
  }
}
