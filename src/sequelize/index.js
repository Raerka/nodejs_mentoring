/*
import Sequelize from 'sequelize';

// export const sequelize = new Sequelize('postgres://node:123456:3000/exampledb');


export const sequelize = new Sequelize('exampledb', 'node', '123456', {
  host: 'localhost',
  port: '3000',
  dialect: 'postgres',
  operatorsAliases: false,
  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});

*/
