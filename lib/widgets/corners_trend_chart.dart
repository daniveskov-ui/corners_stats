import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class CornersTrendChart extends StatelessWidget {
  final List<double> corners;
  final double average;

  const CornersTrendChart({
    super.key,
    required this.corners,
    required this.average,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 6,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Last Matches Corners',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 220,
              child: LineChart(
                LineChartData(
                  minY: 0,
                  gridData: FlGridData(show: true),
                  titlesData: FlTitlesData(
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) =>
                            Text('M${value.toInt() + 1}'),
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: true),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    /// MATCHES LINE
                    LineChartBarData(
                      spots: corners
                          .asMap()
                          .entries
                          .map(
                            (e) => FlSpot(
                              e.key.toDouble(),
                              e.value,
                            ),
                          )
                          .toList(),
                      isCurved: true,
                      barWidth: 3,
                      dotData: FlDotData(show: true),
                      color: Colors.blue,
                    ),

                    /// AVERAGE LINE
                    LineChartBarData(
                      spots: List.generate(
                        corners.length,
                        (i) => FlSpot(i.toDouble(), average),
                      ),
                      isCurved: false,
                      barWidth: 2,
                      dotData: FlDotData(show: false),
                      color: Colors.orange,
                      dashArray: [5, 5],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Blue = Match corners | Orange = Average',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
