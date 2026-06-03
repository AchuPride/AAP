const router = require('express').Router();
const { listUsers, createUser, toggleUserActive, getStats, listOfficers, getAuditLogs } = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate, createUserSchema } = require('../middleware/validate');

router.use(authenticate, requireRole('admin'));

router.get('/stats', getStats);
router.get('/officers', listOfficers);
router.get('/users', listUsers);
router.post('/users', validate(createUserSchema), createUser);
router.patch('/users/:id/toggle', toggleUserActive);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
