module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    price: DataTypes.DOUBLE
  }, {});
  
  return products;
};
