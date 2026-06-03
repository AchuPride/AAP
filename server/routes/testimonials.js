const router = require('express').Router();
const {
  getPublicTestimonials,
  getAllTestimonials,
  submitTestimonial,
  approveTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/', getPublicTestimonials);
router.post('/', submitTestimonial);
router.get('/all', authenticate, requireRole('admin'), getAllTestimonials);
router.patch('/:id/approve', authenticate, requireRole('admin'), approveTestimonial);
router.delete('/:id', authenticate, requireRole('admin'), deleteTestimonial);

module.exports = router;
