const router = require('express').Router();
const { getPartners, createPartner, deletePartner } = require('../controllers/partnerController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/', getPartners);
router.post('/', authenticate, requireRole('admin'), createPartner);
router.delete('/:id', authenticate, requireRole('admin'), deletePartner);

module.exports = router;
