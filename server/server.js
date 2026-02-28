const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS inventory (name TEXT PRIMARY KEY, count INTEGER)");
  db.run("CREATE TABLE IF NOT EXISTS user_data (id INTEGER PRIMARY KEY, coins INTEGER, admin INTEGER)");

  db.get("SELECT * FROM user_data WHERE id = 1", (err, row) => {
    if (!row) {
      db.run("INSERT INTO user_data (id, coins, admin) VALUES (1, 10, 0)");
    }
  });
});

app.get("/", (req, res) => {
  res.json({ status: "Server working" });
});

app.get("/user", (req, res) => {
  db.get("SELECT coins FROM user_data WHERE id = 1", (err, row) => {
    res.json({ coins: row.coins });
  });
});

app.get("/inventory", (req, res) => {
  db.all("SELECT * FROM inventory", (err, rows) => {
    res.json(rows);
  });
});

app.post("/spin", (req, res) => {
  db.get("SELECT coins FROM user_data WHERE id = 1", (err, row) => {

    if (row.coins <= 0) {
      return res.json({ success: false });
    }

    const cars = ["bmw", "audi", "tesla", "mercedes"];
    const randomCar = cars[Math.floor(Math.random() * cars.length)];

    db.run("UPDATE user_data SET coins = coins - 1 WHERE id = 1");

    db.get("SELECT * FROM inventory WHERE name = ?", [randomCar], (err, found) => {
      if (found) {
        db.run("UPDATE inventory SET count = count + 1 WHERE name = ?", [randomCar]);
      } else {
        db.run("INSERT INTO inventory (name, count) VALUES (?, 1)", [randomCar]);
      }
    });

    res.json({ success: true, car: randomCar });
  });
});

app.post("/get-coins", (req, res) => {
  db.get("SELECT admin FROM user_data WHERE id = 1", (err, row) => {

    if (!row.admin) {
      return res.json({ success: false });
    }

    db.run("UPDATE user_data SET coins = coins + 5 WHERE id = 1");
    res.json({ success: true });
  });
});

app.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === "1234") {
    db.run("UPDATE user_data SET admin = 1 WHERE id = 1");
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});