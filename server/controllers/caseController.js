const Case = require('../models/Case');
const User = require('../models/User');
const { auditLog } = require('../middleware/auditLog');

/**
 * GET /api/case/:token
 * Public — any user can track their case with a token.
 * Returns status + public timeline only (no internal notes or PII).
 */
const trackCase = async (req, res, next) => {
  try {
    const { token } = req.params;
    const caseData = await Case.findByToken(token.toUpperCase());

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found. Please check your token.' });
    }

    const updates = await Case.getPublicUpdates(caseData.id);

    res.json({
      case_token: caseData.case_token,
      violence_type: caseData.violence_type,
      status: caseData.status,
      location: caseData.location,
      incident_date: caseData.incident_date,
      submitted_at: caseData.created_at,
      last_updated: caseData.updated_at,
      assigned_to: caseData.officer_name || null,
      timeline: updates,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/cases
 * Protected — officers see assigned cases; admins see all.
 */
const listCases = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const officer_id = req.user.role === 'officer' ? req.user.id : undefined;

    const result = await Case.list({
      status,
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50),
      officer_id,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/cases/:id
 * Protected — full case detail including internal notes.
 */
const getCaseDetail = async (req, res, next) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: 'Case not found' });

    if (req.user.role === 'officer' && caseData.assigned_officer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to this case' });
    }

    const updates = await Case.getAllUpdates(caseData.id);
    res.json({ ...caseData, timeline: updates });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/cases/:id
 * Protected — update status, assignment, add notes.
 */
const updateCase = async (req, res, next) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: 'Case not found' });

    if (req.user.role === 'officer' && caseData.assigned_officer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to this case' });
    }

    const { status, public_message, note, assigned_officer_id, is_priority } = req.body;
    const oldStatus = caseData.status;

    // Build the DB update payload
    const updatePayload = {};
    if (status) updatePayload.status = status;
    if (assigned_officer_id !== undefined) updatePayload.assigned_officer_id = assigned_officer_id;
    if (is_priority !== undefined) updatePayload.is_priority = is_priority;

    await Case.updateCase(req.params.id, updatePayload);

    // Determine update_type
    let update_type = 'note';
    if (status && status !== oldStatus) update_type = 'status_change';
    else if (assigned_officer_id !== undefined) update_type = 'assignment';

    await Case.addUpdate({
      case_id: caseData.id,
      updated_by: req.user.id,
      update_type,
      old_status: oldStatus,
      new_status: status || oldStatus,
      note: note || null,
      public_message: public_message || null,
    });

    await auditLog({
      actor_id: req.user.id,
      action: 'case_updated',
      resource: 'cases',
      resource_id: caseData.id,
      metadata: { old_status: oldStatus, new_status: status },
      ip: req.ip,
    });

    const updated = await Case.findById(req.params.id);
    const timeline = await Case.getAllUpdates(caseData.id);
    res.json({ ...updated, timeline });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/cases/stats
 * Admin only.
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await Case.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

module.exports = { trackCase, listCases, getCaseDetail, updateCase, getStats };
