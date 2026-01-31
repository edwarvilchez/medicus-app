const Sequelize = require('sequelize');
require('dotenv').config();

const configs = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'medicus_dev',
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  },
  qa: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'medicus_qa',
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'medicus_prod',
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool
  }
);

module.exports = sequelize;
