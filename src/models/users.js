import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new Schema({
  name: { type: String, required: true, default: '' },
  age: { type: Number, required: true, default: '' },
  isAdmin: { type: Boolean, required: true },
});

/**
 * Methods
 */
UserSchema.methods = {
  /*
    /!**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     *!/
    
    authenticate: function (plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },
    
    /!**
     * Make salt
     *
     * @return {String}
     * @api public
     *!/
    
    makeSalt: function () {
      return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    
    /!**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     *!/
    
    encryptPassword: function (password) {
      if (!password) return '';
      try {
        return crypto
          .createHmac('sha1', this.salt)
          .update(password)
          .digest('hex');
      } catch (err) {
        return '';
      }
    },
    
    /!**
     * Validation is not required if using OAuth
     *!/
    
    skipValidation: function () {
      return ~oAuthTypes.indexOf(this.provider);
    }
  };
  
  /!**
   * Statics
   *!/
  
  UserSchema.statics = {
    
    /!**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     *!/
    
    load: function (options, cb) {
      options.select = options.select || 'name username';
      return this.findOne(options.criteria)
        .select(options.select)
        .exec(cb);
    }*/
};

export const User = mongoose.model('User', UserSchema);
