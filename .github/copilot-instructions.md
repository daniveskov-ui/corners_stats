**Purpose**

This file summarizes the minimal, actionable knowledge an AI coding agent needs to be productive in this Flutter project.

**Big Picture**

The repo is a small Flutter app that fetches/constructs match corner statistics, stores them locally, and renders a prediction UI. Primary flows:
  - Data acquisition: `lib/api_service.dart` calls an external football API (RapidAPI) — currently generating synthetic corner counts from fixture IDs.
  - Persistence: `lib/db_helper.dart` manages a local SQLite DB (`matches` table) using `sqflite`/`path` APIs.
  - Presentation: `lib/prediction_screen.dart` and `lib/corner_chart.dart` consume match records and compute simple averages to display a prediction.

**Key Files / Entry Points**

- [lib/main.dart](lib/main.dart#L1) — app entry; passes a `matches` list into `PredictionScreen` for local debugging.
- [lib/prediction_screen.dart](lib/prediction_screen.dart#L1) — main UI that computes averages and chooses `OVER/UNDER 8.5`.
- [lib/api_service.dart](lib/api_service.dart#L1) — API client; note: contains a hardcoded RapidAPI key and synthetic-corners logic `(fixture.id % n) + m`.
- [lib/db_helper.dart](lib/db_helper.dart#L1) — DB schema and helper functions. Table `matches` fields: `home`, `away`, `corners_home`, `corners_away`, `date` (YYYY-MM-DD).
- [lib/corner_chart.dart](lib/corner_chart.dart#L1) — small stat visualization component used by the UI.
- [lib/corner_prediction.dart](lib/corner_prediction.dart#L1) — simple data model.
- [pubspec.yaml](pubspec.yaml#L1) — lists `fl_chart`, `http`, `intl`. Note: project code imports `sqflite` and `path` but they are not currently declared here.

**Important Patterns & Conventions (repo-specific)**

- Synthetic data: `ApiService.getLastMatches(teamId)` returns a `List<Map<String, dynamic>>` where each map includes `homeCorners` and `awayCorners` (generated from fixture id). Agents should not assume API returns real corner counts without checking `lib/api_service.dart`.
- Date handling: DB stores `date` as `YYYY-MM-DD` strings. `DBHelper.updateMatchesIfNeeded()` compares the `MAX(date)` string to today's `YYYY-MM-DD` string to decide when to refresh — treat dates as normalized strings.
- DB lifecycle: `DBHelper.insertMatches()` deletes all rows before inserting the new set (i.e., table acts as a single-day cache). When adding features, preserve this simplicity or explicitly change the strategy.
- UI data flow: widgets expect already-prepared `List<Map>` records (not domain objects). `PredictionScreen` computes averages from map keys like `homeCorners`/`awayCorners`.

**Integration Points & Security Notes**

- RapidAPI (api-football) is used in `lib/api_service.dart` with a hard-coded key. Replace with a secure configuration (environment variable / secrets) before committing real keys.
- Local storage: `sqflite` and `path` are used in `lib/db_helper.dart` — ensure these packages are added to `pubspec.yaml` and `flutter pub get` is run.

**Developer Workflows / Commands**

- Install deps: `flutter pub get` (ensure `sqflite`/`path` included if DB code will run).
- Run on Windows (dev): `flutter run -d windows` or use an emulator/device for mobile targets.
- Run web (dev): `flutter run -d chrome` (if web target enabled).
- Tests: `flutter test` (project includes `test/widget_test.dart`).
- Android build: `flutter build apk` or use Gradle wrapper in `android/` when needed.

**Common Tasks Examples**

- To fetch synthetic last matches for team 33 (used in `main.dart`): call `await ApiService.getLastMatches(33)` — returns `List<Map>` with keys `home`, `away`, `homeCorners`, `awayCorners`, `date`.
- To update the DB once per day: call `await DBHelper.updateMatchesIfNeeded()` — it will call `fetchMatchesFromAPI()` then `insertMatches()`.

**What to watch for / Known inconsistencies**

- `lib/db_helper.dart` imports `sqflite` and `path` but `pubspec.yaml` currently does not list them. CI or local `flutter pub get` may fail until these dependencies are declared.
- `lib/api_service.dart` currently generates corner values instead of using live corner data — search for `homeCorners` creation in that file before relying on real-world values.

If anything above is unclear or you want this expanded (examples, more file links, or CI instructions), tell me which section to improve. I'll update iteratively.
