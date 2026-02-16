const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

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

  db.run(`INSERT OR IGNORE INTO user_data (id, coins, admin) VALUES (1, 5, 0)`);
});


// Отримати дані
app.get("/user", (req, res) => {
  db.get("SELECT * FROM user_data WHERE id = 1", (err, row) => {
    res.json(row);
  });
});

// Взяти 5 монет
app.post("/get-coins", (req, res) => {
  db.get("SELECT admin FROM user_data WHERE id = 1", (err, row) => {
    if (row.admin === 1) {
      db.run("UPDATE user_data SET coins = coins + 5 WHERE id = 1");
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// Крутити колесо
app.post("/spin", (req, res) => {
  db.get("SELECT coins FROM user_data WHERE id = 1", (err, row) => {
    if (row.coins <= 0) {
      return res.json({ success: false, message: "No coins" });
    }

    const cars = [
      "porsche",
      "bmw",
      "audi",
      "mercedes",
      "tesla",
      "ferrari"
    ];

    const randomCar = cars[Math.floor(Math.random() * cars.length)];

    db.run("UPDATE user_data SET coins = coins - 1 WHERE id = 1");

    db.get("SELECT count FROM inventory WHERE name = ?", [randomCar], (err, row) => {
      if (row) {
        db.run("UPDATE inventory SET count = count + 1 WHERE name = ?", [randomCar]);
      } else {
        db.run("INSERT INTO inventory (name, count) VALUES (?, 1)", [randomCar]);
      }

      res.json({ success: true, car: randomCar });
    });
  });
});

// Інвентар
app.get("/inventory", (req, res) => {
  db.all("SELECT * FROM inventory", (err, rows) => {
    res.json(rows);
  });
});

// Адмін логін
app.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === "0685445") {
    db.run("UPDATE user_data SET admin = 1 WHERE id = 1");
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
const path = require("path");

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});



