const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ===== ÁÀÇÀ ÄÀÍÈÕ =====
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      name TEXT PRIMARY KEY,
      count INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_data (
      id INTEGER PRIMARY KEY,
      coins INTEGER,
      admin INTEGER
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO user_data (id, coins, admin)
    VALUES (1, 5, 0)
  `);
});

// ===== ROUTES =====

// Ïåðåâ³ðêà ñåðâåðà
app.get("/", (req, res) => {
  res.json({ status: "Server working" });
});

// Îòðèìàòè äàí³ êîðèñòóâà÷à
app.get("/user", (req, res) => {
  db.get("SELECT * FROM user_data WHERE id = 1", (err, row) => {
    if (err) return res.status(500).json({ error: err });
    res.json(row);
  });
});

// Àäì³í ëîã³í
app.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === "0685445") {
    db.run("UPDATE user_data SET admin = 1 WHERE id = 1");
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ===== ÇÀÏÓÑÊ ÑÅÐÂÅÐÀ =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});