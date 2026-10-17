require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());           // lets the HTML page call the API
app.use(express.json());   // reads JSON request bodies

// Serve the frontend too (so one deployed link gives you the page AND the API)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const FIELDS = ['name', 'category', 'description', 'meeting_day', 'contact_email', 'members_count'];

// GET all
app.get('/api/clubs', (req, res) => {
  res.json(db.prepare('SELECT * FROM clubs ORDER BY id').all());
});

// GET one
app.get('/api/clubs/:id', (req, res) => {
  const club = db.prepare('SELECT * FROM clubs WHERE id = ?').get(req.params.id);
  if (!club) return res.status(404).json({ error: 'Club not found' });
  res.json(club);
});

// POST create
app.post('/api/clubs', (req, res) => {
  const b = req.body;
  if (!b.name || !b.name.trim()) return res.status(400).json({ error: 'name is required' });

  const info = db.prepare(
    `INSERT INTO clubs (name, category, description, meeting_day, contact_email, members_count)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(b.name.trim(), b.category || null, b.description || null,
        b.meeting_day || null, b.contact_email || null, Number(b.members_count) || 0);

  const created = db.prepare('SELECT * FROM clubs WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT update
app.put('/api/clubs/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM clubs WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Club not found' });

  const merged = { ...existing };
  FIELDS.forEach(f => { if (req.body[f] !== undefined) merged[f] = req.body[f]; });
  if (!merged.name || !String(merged.name).trim()) {
    return res.status(400).json({ error: 'name is required' });
  }

  db.prepare(
    `UPDATE clubs SET name = ?, category = ?, description = ?, meeting_day = ?,
       contact_email = ?, members_count = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(String(merged.name).trim(), merged.category, merged.description, merged.meeting_day,
        merged.contact_email, Number(merged.members_count) || 0, req.params.id);

  res.json(db.prepare('SELECT * FROM clubs WHERE id = ?').get(req.params.id));
});

// DELETE
app.delete('/api/clubs/:id', (req, res) => {
  const info = db.prepare('DELETE FROM clubs WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Club not found' });
  res.json({ message: 'Club deleted', id: Number(req.params.id) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
