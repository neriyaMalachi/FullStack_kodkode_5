// POST /api/admin-verify-code — Body: { code }
// Consumes the one-time code (must be unused and < 10 minutes old). On
// success, starts an admin session (12h, HttpOnly cookie) so the panel
// doesn't need a fresh code on every stats refresh.

const { consumeAdminCode, createAdminSession } = require('./_db');
const { newSessionToken, setAdminSessionCookie } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { code } = req.body || {};
    if (typeof code !== 'string' || !code) {
      res.status(400).json({ error: 'invalid_request' });
      return;
    }

    const valid = await consumeAdminCode(code);
    if (!valid) {
      res.status(401).json({ error: 'invalid_code' });
      return;
    }

    const token = newSessionToken();
    await createAdminSession(token);
    setAdminSessionCookie(res, token);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('admin-verify-code error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
