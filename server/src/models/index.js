const User = require('./User');
const Role = require('./Role');
const Department = require('./Department');
const Specialty = require('./Specialty');
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const Nurse = require('./Nurse');
const Staff = require('./Staff');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const LabResult = require('./LabResult');
const Payment = require('./Payment');
const VideoConsultation = require('./VideoConsultation');

// User - Role
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// Department - Specialty
Department.hasMany(Specialty, { foreignKey: 'departmentId' });
Specialty.belongsTo(Department, { foreignKey: 'departmentId' });

// Doctor - Specialty
Specialty.hasMany(Doctor, { foreignKey: 'specialtyId' });
Doctor.belongsTo(Specialty, { foreignKey: 'specialtyId' });

// User - Profile Associations
User.hasOne(Doctor, { foreignKey: 'userId', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Nurse, { foreignKey: 'userId', onDelete: 'CASCADE' });
Nurse.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Staff, { foreignKey: 'userId', onDelete: 'CASCADE' });
Staff.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Patient, { foreignKey: 'userId', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId' });

// Clinical Associations
Patient.hasMany(MedicalRecord, { foreignKey: 'patientId' });
MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId' });

Doctor.hasMany(MedicalRecord, { foreignKey: 'doctorId' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctorId' });

Patient.hasMany(LabResult, { foreignKey: 'patientId' });
LabResult.belongsTo(Patient, { foreignKey: 'patientId' });

// Payment Associations
Patient.hasMany(Payment, { foreignKey: 'patientId' });
Payment.belongsTo(Patient, { foreignKey: 'patientId' });

Appointment.hasOne(Payment, { foreignKey: 'appointmentId' });
Payment.belongsTo(Appointment, { foreignKey: 'appointmentId' });

// Appointment links
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

// VideoConsultation Associations
User.hasMany(VideoConsultation, { as: 'doctorConsultations', foreignKey: 'doctorId' });
User.hasMany(VideoConsultation, { as: 'patientConsultations', foreignKey: 'patientId' });

VideoConsultation.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
VideoConsultation.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
VideoConsultation.belongsTo(Appointment, { foreignKey: 'appointmentId' });

Appointment.hasOne(VideoConsultation, { foreignKey: 'appointmentId' });

module.exports = {
  User,
  Role,
  Department,
  Specialty,
  Doctor,
  Patient,
  Nurse,
  Staff,
  Appointment,
  MedicalRecord,
  LabResult,
  Payment,
  VideoConsultation
};
