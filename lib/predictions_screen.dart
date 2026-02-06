import 'package:flutter/material.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'dart:io';
import 'package:path_provider/path_provider.dart';

class PredictionsScreen extends StatefulWidget {
  final List<Map<String, dynamic>> matches;

  const PredictionsScreen({super.key, required this.matches});

  @override
  State<PredictionsScreen> createState() => _PredictionsScreenState();
}

class _PredictionsScreenState extends State<PredictionsScreen> {
  double selectedOver = 9.5;
  final List<double> overOptions = [8.0, 8.5, 9.0, 9.5, 10.0];

  List<Map<String, dynamic>> get filteredMatches => widget.matches
      .where((m) =>
          ((m['homeAvg'] + m['awayAvg']) / 2) >= selectedOver)
      .toList();

  Future<void> exportCsv() async {
    final csv = StringBuffer();
    csv.writeln('Home,Away,HomeAvg,AwayAvg');
    for (var m in filteredMatches) {
      csv.writeln(
          '${m['home']},${m['away']},${m['homeAvg']},${m['awayAvg']}');
    }

    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/corners.csv');
    await file.writeAsString(csv.toString());

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('CSV запазен: ${file.path}')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final chartData = filteredMatches
        .map((m) => _MatchData(
            '${m['home']} vs ${m['away']}',
            ((m['homeAvg'] + m['awayAvg']) / 2)))
        .toList();

    final series = [
      charts.Series<_MatchData, String>(
        id: 'Corners',
        data: chartData,
        domainFn: (d, _) => d.match,
        measureFn: (d, _) => d.corners,
        colorFn: (_, __) => charts.MaterialPalette.blue.shadeDefault,
      )
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('📊 Прогноза за корнери'),
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download),
            onPressed: exportCsv,
          )
        ],
      ),
      body: Column(
        children: [
          // Over/Under dropdown
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: DropdownButton<double>(
              value: selectedOver,
              items: overOptions
                  .map((v) => DropdownMenuItem(
                        value: v,
                        child: Text('Over ${v.toStringAsFixed(1)}'),
                      ))
                  .toList(),
              onChanged: (v) {
                if (v != null) setState(() => selectedOver = v);
              },
            ),
          ),

          // Бар графика
          SizedBox(
            height: 200,
            child: charts.BarChart(series, animate: true),
          ),

          // Списък с прогнози
          Expanded(
            child: ListView.builder(
              itemCount: filteredMatches.length,
              itemBuilder: (context, index) {
                final m = filteredMatches[index];
                final double prediction =
                    ((m['homeAvg'] + m['awayAvg']) / 2);

                String verdict;
                Color color;

                if (prediction >= 9.5) {
                  verdict = '🔥 Over 9.5';
                  color = Colors.green;
                } else if (prediction >= 8.0) {
                  verdict = '⚠️ Рисков';
                  color = Colors.orange;
                } else {
                  verdict = '❌ Ниска';
                  color = Colors.red;
                }

                return Card(
                  margin: const EdgeInsets.all(8),
                  child: ListTile(
                    title: Text('${m['home']} vs ${m['away']}'),
                    subtitle: Text(
                      'Прогноза: ${prediction.toStringAsFixed(1)} корнера',
                    ),
                    trailing: Text(verdict,
                        style: TextStyle(
                            fontWeight: FontWeight.bold, color: color)),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _MatchData {
  final String match;
  final double corners;
  _MatchData(this.match, this.corners);
}
