import 'db_helper.dart';
import 'api_service.dart';
import 'package:intl/intl.dart';

class MatchCache {
  static final MatchCache instance = MatchCache._init();
  MatchCache._init();

  Future<List<Map<String, dynamic>>> getMatches() async {
    final dbMatches = await DBHelper.instance.getMatches();
    if (dbMatches.isEmpty) {
      // няма кеш, теглим от API
      return await _updateCache();
    }

    // проверка за дата: ако последният запис е стар повече от ден
    final lastDateStr = dbMatches.first['date'];
    final lastDate = DateTime.parse(lastDateStr);
    final now = DateTime.now();

    if (now.difference(lastDate).inDays >= 1) {
      // обновяваме кеша
      return await _updateCache();
    }

    // връщаме кеша
    return dbMatches;
  }

  Future<List<Map<String, dynamic>>> _updateCache() async {
    final matches = await ApiService.loadMatchesWithStats();

    // изтриваме старите записи
    final db = DBHelper.instance;
    final old = await db.getMatches();
    for (var m in old) {
      // може да добавим метод deleteAll() в DBHelper
    }

    // записваме новите
    for (var m in matches) {
      await DBHelper.instance.insertMatch(m);
    }

    return matches;
  }
}
