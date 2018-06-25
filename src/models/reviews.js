module.exports = (sequelize, DataTypes) => {
  const reviews = sequelize.define('reviews', {
    productId: DataTypes.INTEGER,
    color: DataTypes.STRING,
    size: DataTypes.STRING
  }, {});
  return reviews;
};
