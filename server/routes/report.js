const router = require('express').Router();
const { submitReport, getPublicStats } = require('../controllers/reportController');
const { validate, reportSchema } = require('../middleware/validate');
const { reportLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../middleware/upload');

router.get('/stats', getPublicStats);

router.post(
  '/',
  reportLimiter,
  upload.array('evidence', 5),
  validate(reportSchema),
  submitReport
);

module.exports = router;
