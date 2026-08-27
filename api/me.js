// GET /api/me — returns { email } if the session cookie is valid, else 401.
// Used by auth-gate.js on every page to decide whether to redirect to /login/.

const { findSession } = require('./_db');
const { getSessionToken } = require('./_auth');

module.exports = async function handler(req, res) {
  try {
    const token = getSessionToken(req);
    if (!token) {
      res.status(401).json({ error: 'no_session' });
      return;
    }

    const session = await findSession(token);
    if (!session) {
      res.status(401).json({ error: 'invalid_session' });
      return;
    }

    res.status(200).json({ email: session.email });
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
