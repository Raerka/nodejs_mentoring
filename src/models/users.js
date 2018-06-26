module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  return users;
};
