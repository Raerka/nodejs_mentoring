const products = require('../data/products.json');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const productArr = [];
    products.forEach(function (product) {
      productArr.push({
        name: product.name,
        brand: product.brand,
        price: product.price,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  
    await queryInterface.bulkInsert('products', productArr, {});
  
    const productId = await queryInterface.sequelize.query(`SELECT id FROM products;`);
  
    const reviewsArr = [];
    products.forEach(function (product, i) {
      reviewsArr.push({
        productId: productId[0][i].id,
        color: product.reviews[0].color,
        size: product.reviews[1].size,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    return queryInterface.bulkInsert('reviews', reviewsArr, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reviews', null, {});
    return queryInterface.bulkDelete('products', null, {});
  }
};
