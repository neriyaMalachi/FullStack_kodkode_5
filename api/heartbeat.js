// POST /api/heartbeat — Body: none
// Requires a valid session. Called every ~20s while a student has the site
// open, just to keep their "online now" presence fresh (does NOT log a new
// visit row — that only happens once per real page load, via /api/track).

const { findSession, touchPresence } = require('./_db');
const { getSessionToken } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const token = getSessionToken(req);
    const session = token ? await findSession(token) : null;
    if (!session) {
      res.status(401).json({ error: 'no_session' });
      return;
    }

    await touchPresence(session.user_id);
    res.status(204).end();
  } catch (err) {
    console.error('heartbeat error:', err);
    res.status(500).end();
  }
};
