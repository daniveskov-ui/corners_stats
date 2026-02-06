import 'dart:async';
import 'package:flutter/material.dart';
import 'predictions_screen.dart';
import 'match_cache.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Corners Stats',
      theme: ThemeData.dark(),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Map<String, dynamic>> matches = [];
  bool isLoading = false;
  String? error;
  Timer? _dailyTimer;

  @override
  void initState() {
    super.initState();
    loadData();
    _startDailyUpdate();
  }

  @override
  void dispose() {
    _dailyTimer?.cancel();
    super.dispose();
  }

  Future<void> loadData() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final data = await MatchCache.instance.getMatches();
      setState(() {
        matches = data;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void _startDailyUpdate() {
    final now = DateTime.now();
    final nextMidnight = DateTime(now.year, now.month, now.day + 1);
    final initialDelay = nextMidnight.difference(now);

    _dailyTimer = Timer(initialDelay, () {
      loadData();
      _dailyTimer = Timer.periodic(const Duration(days: 1), (timer) {
        loadData();
      });
