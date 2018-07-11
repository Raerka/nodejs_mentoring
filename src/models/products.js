import mongoose from 'mongoose';
import products from '../data/products.json';

const Schema = mongoose.Schema;

/**
 * Product Schema
 */
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  reviews: {
    color: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    }
  },
  lastModifiedDate: {
    type: Date
  }
});

/**
 * @description
 * Add extra field called lastModifiedDate with the current date for every created/updated item
 * (every PUT and POST request for all product entities)
 *
 */
ProductSchema.pre('save', function(next) {
  this.lastModifiedDate = new Date();
  next();
});

export const Product = mongoose.model('Product', ProductSchema);

/**
 * @description
 * Populating collection from json file
 * It is enough to run it once, before working with database
 *
 */
products.forEach(product => {
  new Product(product).save((error) => {
    if (error) {
      console.log(`Saving product ${product} is failed`);  // eslint-disable-line no-console
      throw error;
    }
  });
});
