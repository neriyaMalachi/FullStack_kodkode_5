// POST /api/admin-visit-log — Body: { userId }
// Requires a valid admin session. Returns one student's full chronological
// visit log (page + approximate time spent — see _db.js's getUserVisits
// for exactly how that's computed) for the admin panel's log modal.

const { getUserVisits, findAdminSession } = require('./_db');
const { getAdminToken } = require('./_auth');

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

    const userId = Number((req.body || {}).userId);
    if (!userId) {
      res.status(400).json({ error: 'invalid_request' });
      return;
    }

    const visits = await getUserVisits(userId);
    res.status(200).json({ visits });
  } catch (err) {
    console.error('admin-visit-log error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
