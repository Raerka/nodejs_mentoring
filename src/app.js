import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import jwt from 'jsonwebtoken';
import passport from 'passport';

import { localStrategy } from './strategies/local';
import { facebookStrategy } from './strategies/facebook';
import { twitterStrategy } from './strategies/twitter';
import { googleStrategy } from './strategies/google';

import { cookieParser } from './middlewares/cookie-parser';
import { queryParser } from './middlewares/query-parser';
import { checkToken } from './middlewares/check-token';

import products from './data/products.json';
import users from './data/users.json';
import authData from './data/auth_data.json';

export const app = express();

passport.use(localStrategy);
passport.use(facebookStrategy);
passport.use(twitterStrategy);
passport.use(googleStrategy);


// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
  authData.forEach(data => {
    if (data.login === user.login) {
      done(null, user);
    }
  });
});

app.use(cookieParser);
app.use(queryParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'SECRET', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//  / GET Return 'Hello World!' string
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//  / GET Return 'You are not authorised' string for failureRedirect
app.get('/fail', (req, res) => {
  res.send('You are not authorised');
});

//  /api/products GET Return ALL products
//  /api/products POST Add NEW product and return it
app.route('/api/products')
  .get(checkToken, (req, res) => {
    res.send(products);
  })
  .post(checkToken, (req, res) => {
    const productsObj = JSON.parse(JSON.stringify(products));
    const product = JSON.parse(JSON.stringify(req.body));
    if (!product.id || productsObj[product.id]) {
      return res.send(`Product with id = ${product.id} already exist or something wrong. Please check your data and request`);
    }
    productsObj[product.id] = product;
    
    const rs = new Readable();
    rs.push(JSON.stringify(productsObj, null, 2));
    rs.push(null);
    rs.pipe(fs.createWriteStream(`${__dirname}${path.sep}data${path.sep}products.json`));
    res.send(product);
  });

//   /api/products/:id GET Return SINGLE product
app.get('/api/products/:id', checkToken, (req, res) => {
  let product = null;
  Object.keys(products).forEach(key => {
    if (req.params.id === products[key].id) {
      product = products[key];
    }
  });
  product
    ? res.send(product)
    : res.send(`Product with id = ${req.params.id} is not found.`);
});

//  /api/products/:id/reviews GET Return ALL reviews for a single product
app.get('/api/products/:id/reviews', checkToken, (req, res) => {
  let review = null;
  Object.keys(products).forEach(key => {
    if (req.params.id === products[key].id && products[key].reviews) {
      review = products[key].reviews;
    }
  });
  review
    ? res.send(review)
    : res.send(`Review for product with id = ${req.params.id} is not found.`);
});

//   /api/users GET Return ALL users
app.get('/api/users', checkToken, (req, res) => {
  res.json(users);
});

//  Simple /auth route. Authentication by login and password with generating token.
app.post('/auth', (req, res) => {
  const {login, password} = req.body;
  let token = null;
  authData.forEach(obj => {
    if (obj.login === login && obj.password === password) {
      const payload = {};
      token = jwt.sign(payload, 'secretKey', {expiresIn: 100});
    }
  });
  token
    ? res.send({
      'code' : 200 ,
      'message' : 'OK' ,
      'data' : {
        'user' : {
          'email' : 'email' ,
          'username' : login
        }
      },
      'token' : token
    })
    : res.status(404).send({
      'code' : 404 ,
      'message' : 'Not Found' ,
      'data' : `You are not authenticated, login ${login} or password ${password} is wrong.`
    });
});


//  /local-auth route. Authentication by login and password with passport.js.
app.post('/local-auth', passport.authenticate('local', {session: false}), (req, res) => {
  const token = jwt.sign({}, 'secretKey', {expiresIn: 100});
  res.send(token);
});


//  /auth/facebook route. Authentication by facebook Strategy.
app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  })
);

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect : '/auth'
  })
);

app.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect : '/',
    failureRedirect : '/auth'
  })
);


// send to google to do the authentication
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// the callback after google has authorized the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/fail'
  })
);




