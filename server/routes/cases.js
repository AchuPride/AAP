const router = require('express').Router();
const { trackCase, listCases, getCaseDetail, updateCase, getStats } = require('../controllers/caseController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate, statusUpdateSchema } = require('../middleware/validate');

// Public — token-based tracking
router.get('/track/:token', trackCase);

// Protected routes
router.use(authenticate);

router.get('/stats', requireRole('admin'), getStats);
router.get('/', listCases);
router.get('/:id', getCaseDetail);
router.put('/:id', validate(statusUpdateSchema), updateCase);

module.exports = router;
