const Testimonial = require('../models/Testimonial');
const { auditLog } = require('../middleware/auditLog');

const getPublicTestimonials = async (req, res, next) => {
  try {
    const list = await Testimonial.listPublic();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

const getAllTestimonials = async (req, res, next) => {
  try {
    const list = await Testimonial.listAll();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

const submitTestimonial = async (req, res, next) => {
  try {
    const { author_name, feedback, category } = req.body;
    const testimonial = await Testimonial.create({ author_name, feedback, category });
    
    // Anonymous submission - no actor_id logged in audit log
    await auditLog({
      action: 'testimonial_submitted',
      resource: 'testimonials',
      resource_id: testimonial.id,
      ip: req.ip,
      metadata: { category }
    });

    res.status(201).json({ message: 'Thank you! Your testimonial has been submitted for moderation.', testimonial });
  } catch (err) {
    next(err);
  }
};

const approveTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.approve(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    await auditLog({
      action: 'testimonial_approved',
      resource: 'testimonials',
      resource_id: id,
      actor_id: req.user.id,
      ip: req.ip
    });

    res.json({ message: 'Testimonial approved successfully.', testimonial });
  } catch (err) {
    next(err);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.remove(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    await auditLog({
      action: 'testimonial_deleted',
      resource: 'testimonials',
      resource_id: id,
      actor_id: req.user.id,
      ip: req.ip
    });

    res.json({ message: 'Testimonial deleted successfully.', testimonial });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicTestimonials,
  getAllTestimonials,
  submitTestimonial,
  approveTestimonial,
  deleteTestimonial
};
