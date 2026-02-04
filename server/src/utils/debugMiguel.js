const { User, Doctor } = require('../models');
const sequelize = require('../config/db.config');

const checkUser = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');
        
        // Find user by email 'miguel@medicus.com' (Assuming Miguel's email, or list all Miguels)
        const users = await User.findAll({ where: { firstName: 'Miguel' }, include: [Doctor] });
        
        console.log('Miguel Users found:', users.length);
        
        users.forEach(u => {
            console.log(`User: ${u.firstName} ${u.lastName} (ID: ${u.id})`);
            console.log(`Role ID: ${u.roleId}`);
            if (u.Doctor) {
                console.log(`Doctor Profile: Yes (ID: ${u.Doctor.id})`);
            } else {
                console.log('Doctor Profile: No');
            }
        });

        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkUser();
