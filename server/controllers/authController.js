const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auditLog } = require('../middleware/auditLog');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);

    // Constant-time check to avoid username enumeration
    if (!user || !user.is_active) {
      await new Promise((r) => setTimeout(r, 200));
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await User.verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    await User.updateLastLogin(user.id);

    await auditLog({
      actor_id: user.id,
      action: 'login',
      resource: 'auth',
      ip: req.ip,
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe };
