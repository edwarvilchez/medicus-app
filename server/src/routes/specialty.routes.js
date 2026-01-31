const express = require('express');
const router = express.Router();
const { Specialty } = require('../models');

// GET all specialties
router.get('/', async (req, res) => {
  try {
    const specialties = await Specialty.findAll({
      order: [['name', 'ASC']]
    });
    res.json(specialties);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ message: 'Error al obtener especialidades' });
  }
});

// GET specialty by ID
router.get('/:id', async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    res.json(specialty);
  } catch (error) {
    console.error('Error fetching specialty:', error);
    res.status(500).json({ message: 'Error al obtener especialidad' });
  }
});

module.exports = router;
