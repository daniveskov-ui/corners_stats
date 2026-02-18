import 'package:flutter/material.dart';

class CornerChart extends StatelessWidget {
  final double home;
  final double away;

  const CornerChart({
    super.key,
    required this.home,
    required this.away,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          _bar(home, Colors.blue, 'Home'),
          const SizedBox(width: 12),
          _bar(away, Colors.red, 'Away'),
        ],
      ),
    );
  }

  Widget _bar(double value, Color color, String label) {
    return Expanded(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(value.toStringAsFixed(1)),
          Container(
            height: value * 10,
            width: 30,
            color: color,
          ),
          const SizedBox(height: 4),
          Text(label),
        ],
      ),
    );
  }
}
