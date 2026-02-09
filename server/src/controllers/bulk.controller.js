const { User, Patient, Doctor, Role, Specialty, sequelize } = require('../models');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

exports.importData = async (req, res) => {
    const { type } = req.params;
    const filePath = req.file.path;
    const results = [];
    const errors = [];
    let successCount = 0;

    try {
        const parser = fs.createReadStream(filePath).pipe(
            parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            })
        );

        for await (const record of parser) {
            const t = await sequelize.transaction();
            try {
                if (type === 'patients') {
                    await importPatient(record, t);
                } else if (type === 'doctors') {
                    await importDoctor(record, t);
                } else {
                    throw new Error('Invalid import type');
                }
                await t.commit();
                successCount++;
            } catch (err) {
                await t.rollback();
                errors.push({ record, error: err.message });
            }
        }

        fs.unlinkSync(filePath); // Delete temp file

        res.json({
            message: `Import completed: ${successCount} successful, ${errors.length} failed.`,
            successCount,
            errorCount: errors.length,
            errors
        });

    } catch (error) {
        console.error('Bulk import error:', error);
        res.status(500).json({ error: error.message });
    }
};

async function importPatient(data, transaction) {
    const patientRole = await Role.findOne({ where: { name: 'PATIENT' } });
    if (!patientRole) throw new Error('Patient role not found');

    const user = await User.create({
        username: data.username,
        email: data.email,
        password: data.password || 'Medicus123!', // Default password if not provided
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        roleId: patientRole.id
    }, { transaction });

    await Patient.create({
        userId: user.id,
        documentId: data.documentId,
        birthDate: data.birthDate,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        allergies: data.allergies
    }, { transaction });
}

async function importDoctor(data, transaction) {
    const doctorRole = await Role.findOne({ where: { name: 'DOCTOR' } });
    if (!doctorRole) throw new Error('Doctor role not found');

    let specialtyId = null;
    if (data.specialty) {
        const specialty = await Specialty.findOne({ where: { name: data.specialty } });
        if (specialty) {
            specialtyId = specialty.id;
        } else {
            const newSpec = await Specialty.create({ name: data.specialty }, { transaction });
            specialtyId = newSpec.id;
        }
    }

    const user = await User.create({
        username: data.username,
        email: data.email,
        password: data.password || 'Medicus123!',
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        roleId: doctorRole.id
    }, { transaction });

    await Doctor.create({
        userId: user.id,
        licenseNumber: data.licenseNumber,
        phone: data.phone,
        address: data.address,
        specialtyId: specialtyId
    }, { transaction });
}
