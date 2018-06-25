const users = require('../data/users.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const userArr = [];
    users.forEach(function (user) {
      userArr.push({
        name: user.name,
        age: user.age,
        isAdmin: user.isAdmin,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    return queryInterface.bulkInsert('users', userArr, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
