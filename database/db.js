const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    name TEXT NOT NULL,
    initialPrice REAL NOT NULL,
    currentPrice REAL NOT NULL,
    priceHistory TEXT NOT NULL,
    url TEXT NOT NULL,
    requestUrl TEXT NOT NULL,
    lastChecked TEXT NOT NULL
)`);

module.exports = db;

