const router = require('express').Router();
const { getNews, createNews, deleteNews } = require('../controllers/newsController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/', getNews);
router.post('/', authenticate, requireRole('admin'), createNews);
router.delete('/:id', authenticate, requireRole('admin'), deleteNews);

module.exports = router;
