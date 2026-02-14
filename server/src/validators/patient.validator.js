const Joi = require('joi');

const createPatientSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Username debe tener al menos 3 caracteres',
    'any.required': 'Username es requerido',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email debe ser válido',
    'any.required': 'Email es requerido',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password debe tener al menos 8 caracteres',
    'any.required': 'Password es requerido',
  }),
  firstName: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Nombre es requerido',
  }),
  lastName: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Apellido es requerido',
  }),
  phone: Joi.string()
    .pattern(/^[+]?[\d\s-()]+$/)
    .min(7)
    .max(20)
    .optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid('M', 'F', 'Other').optional(),
  address: Joi.string().max(255).optional(),
  bloodType: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional(),
  emergencyContact: Joi.string().max(100).optional(),
  emergencyPhone: Joi.string()
    .pattern(/^[+]?[\d\s-()]+$/)
    .min(7)
    .max(20)
    .optional(),
});

const updatePatientSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).optional(),
  lastName: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[+]?[\d\s-()]+$/)
    .min(7)
    .max(20)
    .optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid('M', 'F', 'Other').optional(),
  address: Joi.string().max(255).optional(),
  bloodType: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional(),
  emergencyContact: Joi.string().max(100).optional(),
  emergencyPhone: Joi.string()
    .pattern(/^[+]?[\d\s-()]+$/)
    .min(7)
    .max(20)
    .optional(),
}).min(1);

const patientIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'ID debe ser un UUID válido',
    'any.required': 'ID es requerido',
  }),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
  patientIdSchema,
};
