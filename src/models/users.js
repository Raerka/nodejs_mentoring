import mongoose from 'mongoose';
import users from '../data/users.json';

const Schema = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  lastModifiedDate: {
    type: Date,
  }
});

/**
 * @description
 * Add extra field called lastModifiedDate with the current date for every created/updated item
 * (every PUT and POST request for all product entities)
 *
 */
UserSchema.pre('save', function(next) {
  this.lastModifiedDate = new Date();
  next();
});

export const User = mongoose.model('User', UserSchema);

/**
 * @description
 * Populating collection from json file
 * It is enough to run it once, before working with database
 *
 */
users.forEach(user => {
  new User(user).save((error) => {
    if (error) {
      console.log(`Saving user ${user} is failed`);  // eslint-disable-line no-console
      throw error;
    }
  });
});
