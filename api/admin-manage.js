// Vercel serverless function — POST /api/admin-manage
// Body: { action: 'add' | 'update' | 'delete', ...fields }
// Requires a valid admin session cookie, same as admin-stats.js. Lets the
// instructor add/edit/delete student accounts from the admin panel. Returns
// the fresh { students, online } snapshot on success so the frontend can
// re-render without a second call.

const { findUserByEmail, createUser, updateUserEmail, updateUserPassword, deleteUser, getStats, findAdminSession } = require('./_db');
const { hashPassword, getAdminToken } = require('./_auth');

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { action, userId, email, newPassword } = req.body || {};
    const token = getAdminToken(req);

    if (!token || !(await findAdminSession(token))) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    if (action === 'add') {
      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'invalid_email' });
        return;
      }
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        res.status(400).json({ error: 'weak_password' });
        return;
      }
      const normalizedEmail = email.trim().toLowerCase();
      if (await findUserByEmail(normalizedEmail)) {
        res.status(409).json({ error: 'email_taken' });
        return;
      }
      await createUser(normalizedEmail, hashPassword(newPassword));
    } else if (action === 'update') {
      const id = Number(userId);
      if (!id) {
        res.status(400).json({ error: 'invalid_request' });
        return;
      }
      if (email) {
        if (!isValidEmail(email)) {
          res.status(400).json({ error: 'invalid_email' });
          return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await findUserByEmail(normalizedEmail);
        if (existing && Number(existing.id) !== id) {
          res.status(409).json({ error: 'email_taken' });
          return;
        }
        await updateUserEmail(id, normalizedEmail);
      }
      if (newPassword) {
        if (newPassword.length < 6) {
          res.status(400).json({ error: 'weak_password' });
          return;
        }
        await updateUserPassword(id, hashPassword(newPassword));
      }
    } else if (action === 'delete') {
      const id = Number(userId);
      if (!id) {
        res.status(400).json({ error: 'invalid_request' });
        return;
      }
      await deleteUser(id);
    } else {
      res.status(400).json({ error: 'unknown_action' });
      return;
    }

    const { students, online } = await getStats();
    res.status(200).json({ students, online });
  } catch (err) {
    console.error('admin-manage error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
