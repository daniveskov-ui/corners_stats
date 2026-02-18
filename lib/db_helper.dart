import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DBHelper {
  static Database? _db;

  static Future<Database> get database async {
    _db ??= await _initDb();
    return _db!;
  }

  static Future<Database> _initDb() async {
    final path = join(await getDatabasesPath(), 'predictions.db');

    return openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            predicted REAL,
            confidence REAL,
            odds REAL,
            edge REAL,
            kelly REAL,
            createdAt TEXT
          )
        ''');
      },
    );
  }

  static Future<void> save(Map<String, dynamic> data) async {
    final db = await database;
    await db.insert('predictions', data);
  }
}
