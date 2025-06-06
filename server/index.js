import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'database.sqlite'));

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS missing_persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    last_seen DATE NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    contact_info TEXT NOT NULL,
    status TEXT DEFAULT 'missing' CHECK (status IN ('missing', 'found')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Get all missing persons
app.get('/api/missing-persons', (req, res) => {
  const stmt = db.prepare('SELECT * FROM missing_persons ORDER BY created_at DESC');
  const missingPersons = stmt.all();
  res.json(missingPersons);
});

// Add new missing person
app.post('/api/missing-persons', (req, res) => {
  const { name, age, lastSeen, location, description, contactInfo } = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO missing_persons (name, age, last_seen, location, description, contact_info)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(name, age, lastSeen, location, description, contactInfo);
  res.json({ id: result.lastInsertRowid });
});

// Update person status
app.put('/api/missing-persons/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const stmt = db.prepare('UPDATE missing_persons SET status = ? WHERE id = ?');
  const result = stmt.run(status, id);
  
  if (result.changes === 0) {
    res.status(404).json({ error: 'Person not found' });
  } else {
    res.json({ success: true });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});