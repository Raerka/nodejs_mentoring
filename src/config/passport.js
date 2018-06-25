import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import authData from '../data/auth_data.json';
import {config} from './auth_config';

export const configurePassport = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    authData.forEach(data => {
      if (data.login === user.login) {
        done(null, user);
      }
    });
  });
  
  // -----LocalStrategy Login-----
  
  passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    session: false
  },
  (login, password, done) => {
    process.nextTick(() => {
      let user = null;
      authData.forEach(data => {
        if (data.login === login) {
          user = data;
        }
      });
      if (!user || user.password !== password) {
        done(null, false, 'Bad username/password combination');
      } else {
        done(null, user);
      }
    });
  }));
  
  // -----FacebookStrategy Login-----

  passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL
  },
  (accessToken, refreshToken, profile, done) => {
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
  }));
  
  // -----TwitterStrategy Login-----
  
  passport.use(new TwitterStrategy({
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
  }));
  
  // -----GoogleStrategy Login-----
  
  passport.use(new GoogleStrategy({
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
  }));
};
