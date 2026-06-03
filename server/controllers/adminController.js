const User = require('../models/User');
const Case = require('../models/Case');
const AuditLog = require('../models/AuditLog');
const { auditLog } = require('../middleware/auditLog');

const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await User.list({ page: parseInt(page), limit: parseInt(limit) });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, password, full_name, role } = req.body;

    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await User.create({ username, password, full_name, role });

    await auditLog({
      actor_id: req.user.id,
      action: 'user_created',
      resource: 'users',
      resource_id: user.id,
      metadata: { username, role },
      ip: req.ip,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const toggleUserActive = async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    const user = await User.toggleActive(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await auditLog({
      actor_id: req.user.id,
      action: user.is_active ? 'user_activated' : 'user_deactivated',
      resource: 'users',
      resource_id: user.id,
      ip: req.ip,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await Case.getStats();
    const officers = await User.listOfficers();
    res.json({ stats, officers });
  } catch (err) {
    next(err);
  }
};

const listOfficers = async (req, res, next) => {
  try {
    const officers = await User.listOfficers();
    res.json(officers);
  } catch (err) {
    next(err);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await AuditLog.list({ page: parseInt(page), limit: parseInt(limit) });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, createUser, toggleUserActive, getStats, listOfficers, getAuditLogs };
