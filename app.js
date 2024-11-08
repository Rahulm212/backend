const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, '../database', 'sqlite.db'); // Replace with your actual DB filename

app.use(cors());
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Endpoint to get reservation data
app.get("/restaurants", (req, res) => {
  const { betrieb_id, id, status } = req.query;

  let query = `SELECT * FROM reservations`;

  if (status && betrieb_id) {
    query = `${query} WHERE betriebId = ? AND status = ?`;
    return db.all(query, [betrieb_id, status], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (rows.length < 1) {
        return res
          .status(404)
          .json({ message: "No data found", status_code: 404 });
      }
      return res.json(rows); // Only return once
    });
  }
  if (status) {
    query = `${query} WHERE status = ?`;
    return db.all(query, [status], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (rows.length < 1) {
        return res
          .status(404)
          .json({ message: "No data found", status_code: 404 });
      }
      return res.json(rows); // Only return once
    });
  }

  if (betrieb_id) {
    query = `${query} WHERE betriebId = ?`;
    return db.all(query, [betrieb_id], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (rows.length < 1) {
        return res
          .status(404)
          .json({ message: "No data found", status_code: 404 });
      }
      return res.json(rows); // Only return once
    });
  }

  if (id) {
    query = `${query} WHERE id = ?`;
    return db.all(query, [id], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (rows.length < 1) {
        return res
          .status(404)
          .json({ message: "No reservation found", status_code: 404 });
      }
      return res.json(rows); // Only return once
    });
  }

  // If no query parameters are passed, return all data
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json(rows); // Only return once
  });
});


