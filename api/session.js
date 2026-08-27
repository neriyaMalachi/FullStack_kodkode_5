// /api/session — student login session, consolidated to stay under Vercel
// Hobby's 12-serverless-function cap (was login.js + logout.js + me.js).
// GET  -> "who am I" check (was /api/me)
// POST { action: 'login', email, password }  -> was /api/login
// POST { action: 'logout' }                  -> was /api/logout

const { findUserByEmail, createSession, findSession, deleteSession } = require('./_db');
const { verifyPassword, newSessionToken, setSessionCookie, getSessionToken, clearSessionCookie } = require('./_auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const token = getSessionToken(req);
      const session = token ? await findSession(token) : null;
      if (!session) {
        res.status(401).json({ error: 'no_session' });
        return;
      }
      res.status(200).json({ email: session.email });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).end();
      return;
    }

    const { action } = req.body || {};

    if (action === 'login') {
      const { email, password } = req.body || {};
      if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({ error: 'invalid_request' });
        return;
      }
      const normalizedEmail = email.trim().toLowerCase();
      const user = await findUserByEmail(normalizedEmail);
      if (!user || !verifyPassword(password, user.password_hash)) {
        res.status(401).json({ error: 'invalid_credentials' });
        return;
      }
      const token = newSessionToken();
      await createSession(token, user.id);
      setSessionCookie(res, token);
      res.status(200).json({ email: user.email });
      return;
    }

    if (action === 'logout') {
      const token = getSessionToken(req);
      if (token) await deleteSession(token);
      clearSessionCookie(res);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: 'unknown_action' });
  } catch (err) {
    console.error('session error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
