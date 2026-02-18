import 'package:flutter/material.dart';

class BetSignalCard extends StatelessWidget {
  final String bet;
  final double confidence;
  final double predicted;

  const BetSignalCard({
    super.key,
    required this.bet,
    required this.confidence,
    required this.predicted,
  });

  Color get _color {
    switch (bet) {
      case 'OVER 9.5':
        return Colors.green;
      case 'UNDER 9.5':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
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
              'Predicted Corners',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 6),
            Text(
              predicted.toStringAsFixed(2),
              style: const TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),

            /// BET SIGNAL
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 18),
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  bet,
                  style: const TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            /// CONFIDENCE
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Confidence',
                  style: TextStyle(fontSize: 16),
                ),
                Text(
                  '${(confidence * 100).toStringAsFixed(1)}%',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: confidence,
                minHeight: 10,
                backgroundColor: Colors.grey.shade300,
                color: _color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
