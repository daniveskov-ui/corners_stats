import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'models/prediction.dart';

class HistoryService {
  static const _key = 'history';

  static Future<void> save(Prediction p) async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_key) ?? [];

    list.insert(0, json.encode({
      'predicted': p.predicted,
      'line': p.line,
      'bet': p.bet,
      'confidence': p.confidence,
      'time': DateTime.now().toIso8601String(),
    }));

    await prefs.setStringList(_key, list.take(50).toList());
  }

  static Future<List<Map<String, dynamic>>> load() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_key) ?? [];
    return list.map((e) => json.decode(e)).toList();
  }
}
