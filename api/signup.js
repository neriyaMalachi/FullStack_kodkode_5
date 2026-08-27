// POST /api/signup — Body: { email, password }
// Creates a new account (email must be unique), hashes the password, starts
// a session immediately (sets the session cookie) and returns { email }.

const { createUser, findUserByEmail } = require('./_db');
const { hashPassword, newSessionToken, setSessionCookie } = require('./_auth');
const { createSession } = require('./_db');

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { email, password } = req.body || {};

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'invalid_email' });
      return;
    }
    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'weak_password' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await findUserByEmail(normalizedEmail);
    if (existing) {
      res.status(409).json({ error: 'email_taken' });
      return;
    }

    const passwordHash = hashPassword(password);
    const userId = await createUser(normalizedEmail, passwordHash);

    const token = newSessionToken();
    await createSession(token, userId);
    setSessionCookie(res, token);

    res.status(200).json({ email: normalizedEmail });
  } catch (err) {
    console.error('signup error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
