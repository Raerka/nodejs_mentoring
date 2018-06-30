import mongoose from 'mongoose';
import cities from '../data/cities.json';

const Schema = mongoose.Schema;

/**
 * @description Validate country, it can be only Belarus or Russia
 *
 * @param {string} value
 * @return {boolean}
 */
const  countryValidator = (value) => {
  return value === 'Belarus' || value === 'Russia';
};

/**
 * City Schema
 */
const CitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    validate: {
      validator: countryValidator,
      msg: 'Please check your `{PATH}`. It has to be Moscow or Belarus. Your value is `{VALUE}`'} },
  capital: {
    type: Boolean,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    long: {
      type: Number,
      required: true
    }
  },
  lastModifiedDate: {
    type: Date,
    required: false
  }
});

/**
 * @description
 * Add extra field called lastModifiedDate with the current date for every created/updated item
 * (every PUT and POST request for all city entities)
 *
 */
CitySchema.pre('save', function(next) {
  this.lastModifiedDate = new Date();
  next();
});

export const City = mongoose.model('City', CitySchema);

/**
 * @description
 * Populating collection from json file
 * It is enough to run it once, before working with database
 *
 */
cities.forEach(city => {
  new City(city).save((error) => {
    if (error) {
      console.log(`Saving city ${city} is failed`);  // eslint-disable-line no-console
      throw error;
    }
  });
});
