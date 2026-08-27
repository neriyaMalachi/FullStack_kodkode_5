// POST /api/logout — clears the session (server-side + cookie).

const { deleteSession } = require('./_db');
const { getSessionToken, clearSessionCookie } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const token = getSessionToken(req);
    if (token) await deleteSession(token);
    clearSessionCookie(res);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('logout error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
