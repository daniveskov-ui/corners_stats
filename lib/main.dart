import 'package:flutter/material.dart';
import 'prediction_screen.dart';

void main() {

  runApp(const MyApp());

}

class MyApp extends StatefulWidget {

  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();

}

class _MyAppState extends State<MyApp> {

  bool darkMode = true;

  @override
  Widget build(BuildContext context) {

    return MaterialApp(

      debugShowCheckedModeBanner: false,

      theme: ThemeData.light(),

      darkTheme: ThemeData.dark(),

      themeMode:
          darkMode
              ? ThemeMode.dark
              : ThemeMode.light,

      home: PredictionScreen(

        darkMode: darkMode,

        onToggleTheme: () {

          setState(() {

            darkMode = !darkMode;

          });

        },

      ),

    );

  }

}
