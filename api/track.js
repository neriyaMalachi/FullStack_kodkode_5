// POST /api/track — Body: { path }
// Requires a valid session. Records one visit row (for the historical count
// in /admin) and marks the student as "online now".

const { findSession, recordVisit } = require('./_db');
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

    const { path } = req.body || {};
    await recordVisit(session.user_id, typeof path === 'string' ? path.slice(0, 300) : '/');

    res.status(204).end();
  } catch (err) {
    console.error('track error:', err);
    res.status(500).end();
  }
};
