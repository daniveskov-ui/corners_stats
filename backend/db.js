const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./fund.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS fund (
            id INTEGER PRIMARY KEY,
            bankroll REAL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            match TEXT,
            stake REAL,
            odds REAL,
            result TEXT,
            profit REAL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

module.exports = db;
