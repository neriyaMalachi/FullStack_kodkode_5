// POST /api/admin-logout — ends the admin session (server-side + cookie).

const { deleteAdminSession } = require('./_db');
const { getAdminToken, clearAdminSessionCookie } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const token = getAdminToken(req);
    if (token) await deleteAdminSession(token);
    clearAdminSessionCookie(res);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('admin-logout error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
