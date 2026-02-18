import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {

  // ВАЖНО: използвай 127.0.0.1 вместо localhost
  static const String baseUrl =
      "http://127.0.0.1:3000";

  static Future<List<dynamic>>
      scanMatches() async {

    final response =
        await http.get(
      Uri.parse("$baseUrl/scan"),
    );

    if (response.statusCode == 200) {

      return json.decode(
          response.body);

    } else {

      throw Exception(
        "Server error: ${response.statusCode}",
      );

    }

  }

}
