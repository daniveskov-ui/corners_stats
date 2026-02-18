import 'package:flutter/material.dart';
import 'db_helper.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  List<Map<String, dynamic>> bets = [];
  Map<String, double> stats = {};

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    bets = await DBHelper.getBets();
    stats = await DBHelper.getStats();
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Betting History')),
      body: Column(
        children: [
          /// STATS
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _stat('Bets', stats['total']),
                _stat('Wins', stats['wins']),
                _stat('ROI', (stats['roi'] ?? 0) * 100, suffix: '%'),
                _stat('Profit', stats['profit']),
              ],
            ),
          ),

          const Divider(),

          /// LIST
          Expanded(
            child: ListView.builder(
              itemCount: bets.length,
              itemBuilder: (_, i) {
                final b = bets[i];
                return ListTile(
                  title: Text('${b['home']} vs ${b['away']}'),
                  subtitle: Text(
                    '${b['bet']} | Pred: ${b['predicted']} | Actual: ${b['actual']}',
                  ),
                  trailing: Text(
                    b['profit'].toStringAsFixed(2),
                    style: TextStyle(
                      color: b['profit'] > 0
                          ? Colors.green
                          : Colors.red,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _stat(String label, double? value,
      {String suffix = ''}) {
    return Column(
      children: [
        Text(
          value == null ? '-' : value.toStringAsFixed(1) + suffix,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(label),
      ],
    );
  }
}
