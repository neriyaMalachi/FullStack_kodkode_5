// /api/admin-data — everything the admin panel reads/writes about students,
// consolidated to stay under Vercel Hobby's 12-function cap (was
// admin-stats.js + admin-manage.js + admin-visit-log.js). Requires a valid
// admin session (see api/admin-auth.js) on every call.
// POST { action: 'stats' }                                      -> was /api/admin-stats
// POST { action: 'visit-log', userId }  -> was /api/admin-visit-log; also
//   returns completedLessonIds so the panel can build a per-topic learning
//   breakdown (visited vs. actually marked complete), not just a raw log.
// POST { action: 'manage', manageAction: 'add', email, newPassword }
// POST { action: 'manage', manageAction: 'update', userId, email?, newPassword? }
// POST { action: 'manage', manageAction: 'delete', userId }     -> was /api/admin-manage

const {
  getStats,
  findAdminSession,
  findUserByEmail,
  createUser,
  updateUserEmail,
  updateUserPassword,
  deleteUser,
  getUserVisits,
  getUserProgress,
} = require('./_db');
const { getAdminToken, hashPassword } = require('./_auth');

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const token = getAdminToken(req);
    if (!token || !(await findAdminSession(token))) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const { action, manageAction, userId, email, newPassword } = req.body || {};

    if (action === 'stats') {
      const { students, online } = await getStats();
      res.status(200).json({ students, online });
      return;
    }

    if (action === 'visit-log') {
      const id = Number(userId);
      if (!id) {
        res.status(400).json({ error: 'invalid_request' });
        return;
      }
      const visits = await getUserVisits(id);
      const completedLessonIds = await getUserProgress(id);
      res.status(200).json({ visits, completedLessonIds });
      return;
    }

    if (action === 'manage') {
      if (manageAction === 'add') {
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
      } else if (manageAction === 'update') {
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
      } else if (manageAction === 'delete') {
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
      return;
    }

    res.status(400).json({ error: 'unknown_action' });
  } catch (err) {
    console.error('admin-data error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
