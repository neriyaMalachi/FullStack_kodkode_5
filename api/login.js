// POST /api/login — Body: { email, password }
// Verifies credentials, starts a session (sets the session cookie), returns
// { email }. Generic "invalid credentials" error either way — never reveal
// whether the email exists.

const { findUserByEmail, createSession } = require('./_db');
const { verifyPassword, newSessionToken, setSessionCookie } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
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
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
