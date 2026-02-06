import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DBHelper {
  static final DBHelper instance = DBHelper._init();
  static Database? _database;

  DBHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('matches.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    await db.execute('''
    CREATE TABLE matches(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      home TEXT NOT NULL,
      away TEXT NOT NULL,
      date TEXT NOT NULL,
      homeAvg REAL NOT NULL,
      awayAvg REAL NOT NULL
    )
    ''');
  }

  Future<int> insertMatch(Map<String, dynamic> match) async {
    final db = await instance.database;
    return await db.insert('matches', match);
  }

  Future<List<Map<String, dynamic>>> getMatches() async {
    final db = await instance.database;
    return await db.query('matches', orderBy: 'id DESC');
  }
}
