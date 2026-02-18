import 'package:flutter/material.dart';
import '../value_betting.dart';

class ValueBetCard extends StatelessWidget {
  final ValueBetResult result;
  final double odds;

  const ValueBetCard({
    super.key,
    required this.result,
    required this.odds,
  });

  @override
  Widget build(BuildContext context) {
    final color =
        result.isValue ? Colors.green : Colors.grey;

    return Card(
      elevation: 6,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Value Betting',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),

            _row('Odds', odds.toStringAsFixed(2)),
            _row(
              'Model Prob.',
              '${(result.modelProbability * 100).toStringAsFixed(1)}%',
            ),
            _row(
              'Implied Prob.',
              '${(result.impliedProbability * 100).toStringAsFixed(1)}%',
            ),
            _row(
              'Edge',
              '${(result.edge * 100).toStringAsFixed(1)}%',
              bold: true,
            ),

            const SizedBox(height: 20),

            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Center(
                child: Text(
                  result.isValue
                      ? '🔥 VALUE BET'
                      : 'NO VALUE',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _row(String label, String value,
      {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment:
            MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: TextStyle(
              fontWeight:
                  bold ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
