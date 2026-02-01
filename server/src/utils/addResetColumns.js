const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

async function addResetPasswordColumns() {
  try {
    console.log('Agregando columnas de reset de contraseña...');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // Check if columns exist
    const tableDescription = await queryInterface.describeTable('Users');
    
    if (!tableDescription.resetToken) {
      await queryInterface.addColumn('Users', 'resetToken', {
        type: DataTypes.STRING,
        allowNull: true
      });
      console.log('✓ Columna resetToken agregada');
    } else {
      console.log('✓ Columna resetToken ya existe');
    }
    
    if (!tableDescription.resetExpires) {
      await queryInterface.addColumn('Users', 'resetExpires', {
        type: DataTypes.DATE,
        allowNull: true
      });
      console.log('✓ Columna resetExpires agregada');
    } else {
      console.log('✓ Columna resetExpires ya existe');
    }
    
    console.log('\n✅ Migración completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addResetPasswordColumns();
