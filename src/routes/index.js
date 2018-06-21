import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import jwt from 'jsonwebtoken';
import { checkToken } from '../middlewares/check-token';

import products from '../data/products.json';
import users from '../data/users.json';
import authData from '../data/auth_data.json';

export const configureRoutes = (app, passport) => {
  
  //  / - Return 'Hello World!'. Always shows when user is authorised.
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  //  /fail -  Return 'You are not authorised'. Always shows when authorisation fails.
  app.get('/fail', (req, res) => {
    res.send('You are not authorised');
  });

  //  /api/products -  Return all products
  //  /api/products -  Add new product and return it
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

  //   /api/products/:id - Return single product by current id
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

  //  /api/products/:id/reviews - Return all reviews for a single product by id
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

  //   /api/users - Return all users
  app.get('/api/users', checkToken, (req, res) => {
    res.json(users);
  });

  //  /auth - Simple authentication by login and password with generating access token.
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
        'code': 200,
        'message': 'OK',
        'data': {
          'user': {
            'email': 'email',
            'username': login
          }
        },
        'token': token
      })
      : res.status(404).send({
        'code': 404,
        'message': 'Not Found',
        'data': `You are not authenticated, login ${login} or password ${password} is wrong.`
      });
  });
  
  // -----Passport-----

  // -----LocalStrategy-----

  //  /local-auth - Authentication by login and password with passport.js.
  app.post('/local-auth',
    passport.authenticate('local', {
      session: false
    }),
    (req, res) => {
      const token = jwt.sign({}, 'secretKey', {expiresIn: 100});
      res.send(token);
    }
  );
  
  // -----Facebook Strategy-----

  //  /auth/facebook - Authentication by facebook Strategy.
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['public_profile', 'email']
    })
  );

  //  /auth/facebook/callback - Handle the callback after facebook has authenticated the user.
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/fail'
    })
  );
  
  // -----Twitter Strategy-----
  
  //  /auth/twitter - Authentication by twitter Strategy.
  app.get('/auth/twitter', passport.authenticate('twitter'));

  //  /auth/twitter/callback - Handle the callback after twitter has authenticated the user.
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/fail'
    })
  );
  
  // -----Google Strategy-----
  
  //  /auth/google - Authentication by google Strategy.
  app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
  
  //  /auth/google/callback - Handle the callback after google has authenticated the user.
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/fail'
    })
  );
};
