require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite'); // built into Node 22.5+ (no install needed)

const db = new DatabaseSync(path.join(__dirname, process.env.DB_FILE || 'campus_crud.db'));

// Creates the table and inserts the 10 sample rows (safe to run every start)
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

module.exports = db;
