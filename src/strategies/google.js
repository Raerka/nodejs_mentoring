import passportGoogle from 'passport-google-oauth';
import authData from '../data/auth_data.json';

import {config} from '../config/config';

const Strategy = passportGoogle.OAuth2Strategy;

export const googleStrategy = new Strategy({
  clientID: config.googleAuth.clientID,
  clientSecret: config.googleAuth.clientSecret,
  callbackURL: config.googleAuth.callbackURL,
},
(token, refreshToken, profile, done) => {
  process.nextTick(() => {
    let user = null;
    authData.forEach(data => {
      if (data.login === profile.displayName) {
        user = data;
      }
    });
    if (!user) {
      done(null, false, 'There are no such user in database');
    } else {
      done(null, user);
    }
  });
});
