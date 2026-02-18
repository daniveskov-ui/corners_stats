import 'package:flutter/material.dart';
import 'api_service.dart';

class PredictionScreen extends StatefulWidget {
  final bool darkMode;
  final VoidCallback onToggleTheme;

  const PredictionScreen({
    Key? key,
    required this.darkMode,
    required this.onToggleTheme,
  }) : super(key: key);

  @override
  State<PredictionScreen> createState() =>
      _PredictionScreenState();
}

class _PredictionScreenState
    extends State<PredictionScreen> {

  List<dynamic> matches = [];

  bool loading = false;

  double bankroll = 1000;

  Future scanMatches() async {

    setState(() => loading = true);

    try {

      final result =
          await ApiService.scanMatches();

      setState(() {

        matches = result;

        loading = false;

      });

    }
    catch (e) {

      setState(() => loading = false);

    }

  }

  double calculateEV(
      double probability,
      double odds) {

    return (probability * odds) - 1;

  }

  double calculateKelly(
      double probability,
      double odds) {

    final b = odds - 1;

    final q = 1 - probability;

    final kelly =
        ((b * probability) - q) / b;

    if (kelly <= 0)
      return 0;

    return kelly * bankroll * 0.25;

  }

  Color getEVColor(double ev) {

    if (ev > 0.10)
      return Colors.green;

    if (ev > 0.05)
      return Colors.orange;

    return Colors.red;

  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(

        title: const Text(
            "QUANT MATCH SCANNER"),

        actions: [

          IconButton(

            icon: Icon(
              widget.darkMode
                  ? Icons.light_mode
                  : Icons.dark_mode,
            ),

            onPressed:
                widget.onToggleTheme,

          ),

        ],

      ),

      body: Column(

        children: [

          const SizedBox(height: 10),

          ElevatedButton(

            onPressed: scanMatches,

            child: const Text(
                "SCAN REAL MATCHES"),

          ),

          const SizedBox(height: 10),

          if (loading)
            const CircularProgressIndicator(),

          Expanded(

            child: ListView.builder(

              itemCount: matches.length,

              itemBuilder:
                  (context, index) {

                final match =
                    matches[index];

                final odds =
                    match["odds"]
                        .toDouble();

                final probability =
                    match["probability"]
                        .toDouble();

                final ev =
                    calculateEV(
                        probability,
                        odds);

                final stake =
                    calculateKelly(
                        probability,
                        odds);

                final isValue =
                    ev > 0.05;

                return Card(

                  margin:
                      const EdgeInsets
                          .all(8),

                  child: Padding(

                    padding:
                        const EdgeInsets
                            .all(12),

                    child: Column(

                      crossAxisAlignment:
                          CrossAxisAlignment
                              .start,

                      children: [

                        Text(

                          "${match["home"]} vs ${match["away"]}",

                          style:
                              const TextStyle(

                            fontSize: 18,

                            fontWeight:
                                FontWeight.bold,

                          ),

                        ),

                        const SizedBox(
                            height: 5),

                        Text(
                            "Odds: $odds"),

                        Text(
                            "Probability: ${(probability * 100).toStringAsFixed(1)}%"),

                        Text(
                            "Line: ${match["line"]}"),

                        Text(

                          "EV: ${(ev * 100).toStringAsFixed(2)}%",

                          style:
                              TextStyle(

                            color:
                                getEVColor(
                                    ev),

                            fontWeight:
                                FontWeight.bold,

                          ),

                        ),

                        Text(
                            "Stake: ${stake.toStringAsFixed(2)}"),

                        const SizedBox(
                            height: 5),

                        if (isValue)

                          Container(

                            padding:
                                const EdgeInsets
                                    .all(6),

                            color:
                                Colors.green,

                            child:
                                const Text(

                              "AUTO BET SIGNAL",

                              style:
                                  TextStyle(

                                color: Colors.white,

                                fontWeight:
                                    FontWeight.bold,

                              ),

                            ),

                          )

                      ],

                    ),

                  ),

                );

              },

            ),

          )

        ],

      ),

    );

  }

}
