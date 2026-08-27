// Shared SQLite (libsql) data-access layer for the auth/tracking API routes.
// Uses @libsql/client so this same code works unchanged against a local file
// now (DATABASE_URL=file:./local.db) or a hosted libsql/Turso DB later
// (DATABASE_URL=libsql://..., DATABASE_AUTH_TOKEN=...) — no rewrite needed.

const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.DATABASE_URL || 'file:./local.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

let ready = null;
function init() {
  if (!ready) {
    ready = db.batch(
      [
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS visits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL REFERENCES users(id),
          path TEXT NOT NULL,
          visited_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS presence (
          user_id INTEGER PRIMARY KEY REFERENCES users(id),
          last_seen TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS admin_codes (
          code TEXT PRIMARY KEY,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          used INTEGER NOT NULL DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS admin_sessions (
          token TEXT PRIMARY KEY,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS progress (
          user_id INTEGER NOT NULL REFERENCES users(id),
          lesson_id TEXT NOT NULL,
          completed_at TEXT NOT NULL DEFAULT (datetime('now')),
          PRIMARY KEY (user_id, lesson_id)
        )`,
        `CREATE TABLE IF NOT EXISTS pending_signups (
          email TEXT PRIMARY KEY,
          password_hash TEXT NOT NULL,
          code TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
      ],
      'write',
    );
  }
  return ready;
}

async function createPendingSignup(email, passwordHash, code) {
  await init();
  await db.execute({
    sql: `INSERT INTO pending_signups (email, password_hash, code) VALUES (?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, code = excluded.code, created_at = datetime('now')`,
    args: [email, passwordHash, code],
  });
}

// Rate-limits re-requesting a code for the same email (someone could
// otherwise use the signup form to spam an arbitrary address).
async function recentPendingSignup(email, withinSeconds) {
  await init();
  const result = await db.execute({
    sql: `SELECT 1 FROM pending_signups WHERE email = ? AND created_at >= datetime('now', ?)`,
    args: [email, `-${withinSeconds} seconds`],
  });
  return !!result.rows[0];
}

// Verifies the code, and if valid, consumes it (deletes the pending row) and
// returns the password hash to create the real account with. Returns null on
// a wrong/expired code — the caller creates nothing in that case.
async function consumePendingSignup(email, code) {
  await init();
  const result = await db.execute({
    sql: `SELECT password_hash FROM pending_signups
          WHERE email = ? AND code = ? AND created_at >= datetime('now', '-10 minutes')`,
    args: [email, code],
  });
  if (!result.rows[0]) return null;
  await db.execute({ sql: 'DELETE FROM pending_signups WHERE email = ?', args: [email] });
  return result.rows[0].password_hash;
}

async function createUser(email, passwordHash) {
  await init();
  const result = await db.execute({
    sql: 'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    args: [email, passwordHash],
  });
  return Number(result.lastInsertRowid);
}

async function findUserByEmail(email) {
  await init();
  const result = await db.execute({
    sql: 'SELECT id, email, password_hash FROM users WHERE email = ?',
    args: [email],
  });
  return result.rows[0] || null;
}

async function findUserById(id) {
  await init();
  const result = await db.execute({
    sql: 'SELECT id, email FROM users WHERE id = ?',
    args: [id],
  });
  return result.rows[0] || null;
}

async function createSession(token, userId) {
  await init();
  await db.execute({
    sql: 'INSERT INTO sessions (token, user_id) VALUES (?, ?)',
    args: [token, userId],
  });
}

async function findSession(token) {
  await init();
  const result = await db.execute({
    sql: `SELECT sessions.user_id AS user_id, users.email AS email
          FROM sessions JOIN users ON users.id = sessions.user_id
          WHERE sessions.token = ? AND sessions.created_at >= datetime('now', '-24 hours')`,
    args: [token],
  });
  return result.rows[0] || null;
}

async function deleteSession(token) {
  await init();
  await db.execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
}

async function recordVisit(userId, path) {
  await init();
  await db.execute({
    sql: 'INSERT INTO visits (user_id, path) VALUES (?, ?)',
    args: [userId, path],
  });
  await touchPresence(userId);
}

// Full chronological visit log for one student, with an approximate
// "time spent on this page" computed as the gap to their NEXT recorded
// visit (whatever page they went to next). This is an approximation from
// existing page-load timestamps, not exact tab-open time — a student idle
// on the same page for a long time without navigating won't show that idle
// time, and the most recent visit's duration is unknown (still null) since
// there's no "next" visit yet to diff against.
async function getUserVisits(userId) {
  await init();
  const result = await db.execute({
    sql: 'SELECT path, visited_at FROM visits WHERE user_id = ? ORDER BY visited_at ASC',
    args: [userId],
  });
  const rows = result.rows;
  return rows.map((r, i) => {
    const next = rows[i + 1];
    let durationSeconds = null;
    if (next) {
      const toUtc = (s) => new Date(s.replace(' ', 'T') + 'Z');
      durationSeconds = Math.max(0, Math.round((toUtc(next.visited_at) - toUtc(r.visited_at)) / 1000));
    }
    return { path: r.path, visited_at: r.visited_at, duration_seconds: durationSeconds };
  });
}

async function touchPresence(userId) {
  await init();
  await db.execute({
    sql: `INSERT INTO presence (user_id, last_seen) VALUES (?, datetime('now'))
          ON CONFLICT(user_id) DO UPDATE SET last_seen = excluded.last_seen`,
    args: [userId],
  });
}

async function getStats() {
  await init();
  const users = await db.execute('SELECT id, email, created_at FROM users ORDER BY created_at DESC');
  const visitStats = await db.execute(`
    SELECT user_id,
           COUNT(*) AS visit_count,
           MIN(visited_at) AS first_seen,
           MAX(visited_at) AS last_seen
    FROM visits
    GROUP BY user_id
  `);
  const progressStats = await db.execute(`
    SELECT user_id, COUNT(*) AS completed_count
    FROM progress
    GROUP BY user_id
  `);
  const online = await db.execute(`
    SELECT users.email AS email
    FROM presence JOIN users ON users.id = presence.user_id
    WHERE presence.last_seen >= datetime('now', '-45 seconds')
  `);

  const statsByUser = new Map(visitStats.rows.map((r) => [Number(r.user_id), r]));
  const progressByUser = new Map(progressStats.rows.map((r) => [Number(r.user_id), Number(r.completed_count)]));

  const students = users.rows.map((u) => {
    const s = statsByUser.get(Number(u.id));
    return {
      id: Number(u.id),
      email: u.email,
      visit_count: s ? Number(s.visit_count) : 0,
      first_seen: s ? s.first_seen : null,
      last_seen: s ? s.last_seen : null,
      progress_count: progressByUser.get(Number(u.id)) || 0,
    };
  });

  return { students, online: online.rows.map((r) => r.email) };
}

async function markProgress(userId, lessonId) {
  await init();
  await db.execute({
    sql: `INSERT INTO progress (user_id, lesson_id) VALUES (?, ?)
          ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed_at = datetime('now')`,
    args: [userId, lessonId],
  });
}

async function unmarkProgress(userId, lessonId) {
  await init();
  await db.execute({
    sql: 'DELETE FROM progress WHERE user_id = ? AND lesson_id = ?',
    args: [userId, lessonId],
  });
}

async function resetProgress(userId) {
  await init();
  await db.execute({ sql: 'DELETE FROM progress WHERE user_id = ?', args: [userId] });
}

async function getUserProgress(userId) {
  await init();
  const result = await db.execute({
    sql: 'SELECT lesson_id FROM progress WHERE user_id = ?',
    args: [userId],
  });
  return result.rows.map((r) => r.lesson_id);
}

async function updateUserEmail(userId, email) {
  await init();
  await db.execute({ sql: 'UPDATE users SET email = ? WHERE id = ?', args: [email, userId] });
}

async function updateUserPassword(userId, passwordHash) {
  await init();
  await db.execute({ sql: 'UPDATE users SET password_hash = ? WHERE id = ?', args: [passwordHash, userId] });
}

async function deleteUser(userId) {
  await init();
  await db.batch(
    [
      { sql: 'DELETE FROM visits WHERE user_id = ?', args: [userId] },
      { sql: 'DELETE FROM presence WHERE user_id = ?', args: [userId] },
      { sql: 'DELETE FROM sessions WHERE user_id = ?', args: [userId] },
      { sql: 'DELETE FROM progress WHERE user_id = ?', args: [userId] },
      { sql: 'DELETE FROM users WHERE id = ?', args: [userId] },
    ],
    'write',
  );
}

async function createAdminCode(code) {
  await init();
  await db.execute({ sql: 'INSERT INTO admin_codes (code) VALUES (?)', args: [code] });
}

// Used to rate-limit /api/admin-request-code so the page can't be used to
// flood the admin's inbox — counts codes issued (whether ever used or not)
// in the last N seconds.
async function countRecentAdminCodes(withinSeconds) {
  await init();
  const result = await db.execute({
    sql: `SELECT COUNT(*) AS c FROM admin_codes WHERE created_at >= datetime('now', ?)`,
    args: [`-${withinSeconds} seconds`],
  });
  return Number(result.rows[0].c);
}

async function consumeAdminCode(code) {
  await init();
  const result = await db.execute({
    sql: `SELECT code FROM admin_codes
          WHERE code = ? AND used = 0 AND created_at >= datetime('now', '-10 minutes')`,
    args: [code],
  });
  if (!result.rows[0]) return false;
  await db.execute({ sql: 'UPDATE admin_codes SET used = 1 WHERE code = ?', args: [code] });
  return true;
}

async function createAdminSession(token) {
  await init();
  await db.execute({ sql: 'INSERT INTO admin_sessions (token) VALUES (?)', args: [token] });
}

async function findAdminSession(token) {
  await init();
  const result = await db.execute({
    sql: `SELECT token FROM admin_sessions WHERE token = ? AND created_at >= datetime('now', '-12 hours')`,
    args: [token],
  });
  return !!result.rows[0];
}

async function deleteAdminSession(token) {
  await init();
  await db.execute({ sql: 'DELETE FROM admin_sessions WHERE token = ?', args: [token] });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  createSession,
  findSession,
  deleteSession,
  recordVisit,
  touchPresence,
  getStats,
  getUserVisits,
  createPendingSignup,
  recentPendingSignup,
  consumePendingSignup,
  updateUserEmail,
  updateUserPassword,
  deleteUser,
  createAdminCode,
  countRecentAdminCodes,
  consumeAdminCode,
  createAdminSession,
  findAdminSession,
  deleteAdminSession,
  markProgress,
  unmarkProgress,
  resetProgress,
  getUserProgress,
};
