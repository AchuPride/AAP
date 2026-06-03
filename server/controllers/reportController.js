const Case = require('../models/Case');
const { generateCaseToken } = require('../utils/token');
const { auditLog } = require('../middleware/auditLog');
const logger = require('../config/logger');

/**
 * POST /api/report
 * Anonymous — no auth required.
 * Returns a case token the reporter must save.
 */
const submitReport = async (req, res, next) => {
  try {
    const { violence_type, description, location, incident_date, incident_category, platform_involved, anonymous_toggle } = req.body;
    const token = generateCaseToken();

    const newCase = await Case.createCase({
      case_token: token,
      violence_type,
      description,
      location,
      incident_date,
      incident_category,
      platform_involved,
      anonymous_toggle
    });

    // Add initial timeline entry
    await Case.addUpdate({
      case_id: newCase.id,
      updated_by: null,
      update_type: 'status_change',
      old_status: null,
      new_status: 'submitted',
      public_message: 'Your report has been received. Please save your case token.',
    });

    // Handle optional file uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await Case.addEvidence({
          case_id: newCase.id,
          filename: file.filename,
          mime_type: file.mimetype,
          size_bytes: file.size,
        });
      }
      await Case.addUpdate({
        case_id: newCase.id,
        updated_by: null,
        update_type: 'evidence_added',
        public_message: `${req.files.length} evidence file(s) attached to your report.`,
      });
    }

    await auditLog({
      action: 'report_submitted',
      resource: 'cases',
      resource_id: newCase.id,
      ip: req.ip,
    });

    logger.info(`New report submitted: ${token}`);

    res.status(201).json({
      message: 'Report submitted successfully.',
      case_token: newCase.case_token,
      status: newCase.status,
      submitted_at: newCase.created_at,
    });
  } catch (err) {
    next(err);
  }
};

const getPublicStats = async (req, res, next) => {
  try {
    const stats = await Case.getStats();
    res.json({
      total: stats.total || 0,
      resolved: stats.resolved || 0,
      under_review: stats.under_review || 0,
      investigating: stats.investigating || 0,
      submitted: stats.submitted || 0,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitReport, getPublicStats };
