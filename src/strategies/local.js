import passportLocal from 'passport-local';
import authData from '../data/auth_data.json';

const Strategy = passportLocal.Strategy;

export const localStrategy = new Strategy({
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
});
