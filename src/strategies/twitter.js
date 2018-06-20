import passportTwitter from 'passport-twitter';
import authData from '../data/auth_data.json';

import {config} from '../config/config';

const Strategy = passportTwitter.Strategy;

export const twitterStrategy = new Strategy({
  consumerKey: config.twitterAuth.consumerKey,
  consumerSecret: config.twitterAuth.consumerSecret,
  callbackURL: config.twitterAuth.callbackURL
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
