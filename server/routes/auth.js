const router = require('express').Router();
const { login, getMe } = require('../controllers/authController');
const { validate, loginSchema } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authenticate, getMe);

module.exports = router;
