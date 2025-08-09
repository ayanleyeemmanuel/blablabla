const { spawnSync } = require('child_process');
const path = require('path');
const dbPath = path.join(__dirname, 'users.db');

function init() {
  spawnSync('sqlite3', [dbPath, 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT);']);
}

function escape(value) {
  return value.replace(/'/g, "''");
}

function addUser(username, password) {
  const sql = `INSERT INTO users (username, password) VALUES ('${escape(username)}', '${escape(password)}');`;
  const result = spawnSync('sqlite3', [dbPath, sql]);
  if (result.status !== 0) {
    const msg = result.stderr.toString();
    if (msg.includes('UNIQUE constraint')) {
      return { error: 'EXISTS' };
    }
    throw new Error(msg);
  }
  const idResult = spawnSync('sqlite3', [dbPath, 'SELECT last_insert_rowid();']);
  const id = parseInt(idResult.stdout.toString().trim(), 10);
  return { id };
}

function getUser(username) {
  const sql = `SELECT id, username, password FROM users WHERE username = '${escape(username)}';`;
  const result = spawnSync('sqlite3', ['-separator', '|', dbPath, sql]);
  if (result.status !== 0) {
    throw new Error(result.stderr.toString());
  }
  const output = result.stdout.toString().trim();
  if (!output) return null;
  const [id, uname, password] = output.split('|');
  return { id: Number(id), username: uname, password };
}

init();

module.exports = { addUser, getUser };
