const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

const addEndDateColumn = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        
        const queryInterface = sequelize.getQueryInterface();
        
        try {
            await queryInterface.addColumn('MedicalRecords', 'medicalLeaveEndDate', {
                type: DataTypes.DATEONLY,
                allowNull: true
            });
            console.log('SUCCESS: Added medicalLeaveEndDate column');
        } catch (e) {
            console.error('FAILED to add medicalLeaveEndDate (might exist):', e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

addEndDateColumn();
