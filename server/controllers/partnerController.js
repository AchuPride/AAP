const Partner = require('../models/Partner');
const { auditLog } = require('../middleware/auditLog');

const getPartners = async (req, res, next) => {
  try {
    const partners = await Partner.list();
    res.json(partners);
  } catch (err) {
    next(err);
  }
};

const createPartner = async (req, res, next) => {
  try {
    const { name, logo_url, description, website_url, contact_info, category } = req.body;
    const partner = await Partner.create({ name, logo_url, description, website_url, contact_info, category });
    
    await auditLog({
      action: 'partner_created',
      resource: 'partners',
      resource_id: partner.id,
      actor_id: req.user.id,
      ip: req.ip,
      metadata: { name }
    });

    res.status(201).json(partner);
  } catch (err) {
    next(err);
  }
};

const deletePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partner = await Partner.remove(id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }

    await auditLog({
      action: 'partner_deleted',
      resource: 'partners',
      resource_id: id,
      actor_id: req.user.id,
      ip: req.ip,
      metadata: { name: partner.name }
    });

    res.json({ message: 'Partner deleted successfully.', partner });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPartners, createPartner, deletePartner };
