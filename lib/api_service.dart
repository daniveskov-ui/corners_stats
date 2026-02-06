import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String apiKey = 'c21f7bfd4414dea310f1262837a3074e';
  static const String baseUrl = 'https://v3.football.api-sports.io';

  static Future<List<Map<String, dynamic>>> fetchUpcomingFixtures() async {
    final url = Uri.parse(
      '$baseUrl/fixtures?league=39&season=2024&next=10',
    );

    final response = await http.get(
      url,
      headers: {'x-apisports-key': apiKey},
    );

    if (response.statusCode != 200) {
      throw Exception('Грешка при теглене на мачове');
    }

    final data = json.decode(response.body);
    final List fixtures = data['response'];

    return fixtures.map<Map<String, dynamic>>((f) {
      return {
        'fixtureId': f['fixture']['id'],
        'date': f['fixture']['date'],
        'home': f['teams']['home']['name'],
        'away': f['teams']['away']['name'],
        'homeId': f['teams']['home']['id'],
        'awayId': f['teams']['away']['id'],
      };
    }).toList();
  }

  static Future<List<int>> fetchLast5Corners(int teamId) async {
    final fixturesUrl = Uri.parse(
      '$baseUrl/fixtures?team=$teamId&last=5',
    );

    final fixturesResponse = await http.get(
      fixturesUrl,
      headers: {'x-apisports-key': apiKey},
    );
    if (fixturesResponse.statusCode != 200) return [];

    final fixturesData = json.decode(fixturesResponse.body);
    final List fixtures = fixturesData['response'];

    List<int> corners = [];

    for (var f in fixtures) {
      final fixtureId = f['fixture']['id'];
      final statsUrl = Uri.parse(
        '$baseUrl/fixtures/statistics?fixture=$fixtureId',
      );

      final statsResponse = await http.get(
        statsUrl,
        headers: {'x-apisports-key': apiKey},
      );
      if (statsResponse.statusCode != 200) continue;

      final statsData = json.decode(statsResponse.body);

      for (var team in statsData['response']) {
        if (team['team']['id'] == teamId) {
          for (var stat in team['statistics']) {
            if (stat['type'] == 'Corner Kicks' &&
                stat['value'] != null) {
              corners.add(stat['value']);
            }
          }
        }
      }
    }

    return corners;
  }

  static double average(List<int> values) {
    if (values.isEmpty) return 0;
    return values.reduce((a, b) => a + b) / values.length;
  }

  static Future<List<Map<String, dynamic>>> loadMatchesWithStats() async {
    final fixtures = await fetchUpcomingFixtures();
    List<Map<String, dynamic>> result = [];

    for (var m in fixtures) {
      final homeCorners = await fetchLast5Corners(m['homeId']);
      final awayCorners = await fetchLast5Corners(m['awayId']);

      result.add({
        'home': m['home'],
        'away': m['away'],
        'date': m['date'],
        'homeAvg': average(homeCorners),
        'awayAvg': average(awayCorners),
      });
    }

    return result;
  }
}
