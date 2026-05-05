const Joi = require('joi');

const reportSchema = Joi.object({
  violence_type: Joi.string()
    .valid('physical', 'sexual', 'psychological', 'economic', 'stalking', 'online_harassment', 'other')
    .required(),
  description: Joi.string().min(20).max(5000).required(),
  location: Joi.string().max(500).optional().allow('', null),
  incident_date: Joi.date().max('now').required(),
});

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(100).required(),
  password: Joi.string().min(8).max(200).required(),
});

const statusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid('submitted', 'under_review', 'assigned', 'investigating', 'resolved', 'closed')
    .required(),
  public_message: Joi.string().max(1000).optional().allow('', null),
  note: Joi.string().max(2000).optional().allow('', null),
  assigned_officer_id: Joi.number().integer().optional().allow(null),
});

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(100).required(),
  password: Joi.string()
    .min(8)
    .max(200)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({ 'string.pattern.base': 'Password must have uppercase, lowercase and a number' }),
  full_name: Joi.string().min(2).max(200).required(),
  role: Joi.string().valid('admin', 'officer').required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => d.message);
    return res.status(422).json({ message: 'Validation failed', errors: details });
  }
  next();
};

module.exports = { validate, reportSchema, loginSchema, statusUpdateSchema, createUserSchema };
