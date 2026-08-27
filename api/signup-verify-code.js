// POST /api/signup-verify-code — Body: { email, code }
// Step 2 of signup: if the code matches what api/signup-request-code.js
// emailed (and hasn't expired), the real account is created now — this is
// the only place a row is actually added to `users`. Starts a session
// immediately on success, same as login.

const { consumePendingSignup, createUser, createSession, findUserByEmail } = require('./_db');
const { newSessionToken, setSessionCookie } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { email, code } = req.body || {};
    if (typeof email !== 'string' || typeof code !== 'string' || !code) {
      res.status(400).json({ error: 'invalid_request' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const passwordHash = await consumePendingSignup(normalizedEmail, code);
    if (!passwordHash) {
      res.status(401).json({ error: 'invalid_code' });
      return;
    }

    // Guard against a very unlikely race: someone else registered this
    // exact email in the few minutes between step 1 and step 2.
    if (await findUserByEmail(normalizedEmail)) {
      res.status(409).json({ error: 'email_taken' });
      return;
    }

    const userId = await createUser(normalizedEmail, passwordHash);
    const token = newSessionToken();
    await createSession(token, userId);
    setSessionCookie(res, token);

    res.status(200).json({ email: normalizedEmail });
  } catch (err) {
    console.error('signup-verify-code error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
