import jwt from 'jsonwebtoken';
import { checkToken } from '../middlewares/check-token';

import authData from '../data/auth_data.json';

import db from '../models';

const User = db.users;
const Product = db.products;
const Review = db.reviews;

export const configureRoutes = (app, passport) => {
  
  
  /**
   *   -----------General Routes-----------
   */
  
  //  / - Return 'Hello World!'. Always shows when user is authorised.
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  //  /fail -  Return 'You are not authorised'. Always shows when authorisation fails.
  app.get('/fail', (req, res) => {
    res.send('You are not authorised');
  });
  
  
  /**
   *   -----------Product's Routes-----------
   */
  
  //  /api/products - GET -  Return all products
  //  /api/products - POST - Add new product and return it
  app.route('/api/products')
    
    .get(checkToken, (req, res) => {
      Product.findAll()
        .then(products => {
          res.send(products);
        });
    })

    .post(checkToken, (req, res) => {
      const product = JSON.parse(JSON.stringify(req.body));
      Product.create({
        name: product.name,
        brand: product.brand,
        price: product.price,
        createdAt: new Date(),
        updatedAt: new Date()
      })
        .then(addedProduct => {
          Review.create({
            productId: addedProduct.id,
            color: product.reviews[0].color,
            size: product.reviews[1].size,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        })
        .then(() => {
          res.send(product);
        })
        .catch(err => {
          console.log('Something went wrong');  // eslint-disable-line no-console
          throw err;
        });
    });

  //   /api/products/:id - GET - Return single product by current id
  //   /api/products/:id - DELETE - Delete single product by current id
  app.route('/api/products/:id')
    
    .get(checkToken, (req, res) => {
      Product.findById(req.params.id)
        .then(product => {
          product
            ? res.send(product)
            : res.send(`Product with id = ${req.params.id} is not found.`);
        });
    })
    
    .delete(checkToken, (req, res) => {
      res.send('Product was deleted!');
    });

  //  /api/products/:id/reviews - Return all reviews for a single product by id
  app.get('/api/products/:id/reviews', checkToken, (req, res) => {
    Review.findOne({ where: {productId: req.params.id}})
      .then(review => {
        review
          ? res.send(review)
          : res.send(`Review for product with id = ${req.params.id} is not found.`);
      });
  });
  
  
  /**
   *   -----------User's Routes-----------
   */

  //   /api/users - Return all users
  app.get('/api/users', checkToken, (req, res) => {
    User.findAll()
      .then(users => {
        res.json(users);
      });
  });
  
  //   /api/users/:id - Delete single user from database
  app.delete('/api/users/:id', checkToken, (req, res) => {
    res.send('User was deleted!');
  });

  
  /**
   *   -----------City's Routes-----------
   */
  
  
  //   /api/cities - GET - Return all cities
  //   /api/cities - POST - Add new city and return it
  app.route('/api/cities')
  
    .get(checkToken, (req, res) => {
      res.send('Return all cities!');
    })
  
    .post(checkToken, (req, res) => {
      res.send('New city was added!');
    });
  
  //   /api/cities/:id - PUT - Update single product by current id
  //   /api/cities/:id - DELETE - Delete single city by current id
  app.route('/api/cities/:id')
    
    .put(checkToken, (req, res) => {
      res.send('City was updated!');
    })
    
    .delete(checkToken, (req, res) => {
      res.send('Product was deleted!');
    });
  
  
  /**
   *   -----------Authenticate's Routes-----------
   */

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
  
  
  /**
   *   -----------Passport-----------
   */

  /**
   *   -----------Local Strategy-----------
   */

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
  
  
  /**
   *   -----------Facebook Strategy-----------
   */
  
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
  
  
  /**
   *   -----------Twitter Strategy-----------
   */
  
  //  /auth/twitter - Authentication by twitter Strategy.
  app.get('/auth/twitter', passport.authenticate('twitter'));

  //  /auth/twitter/callback - Handle the callback after twitter has authenticated the user.
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/fail'
    })
  );
  
  
  /**
   *   -----------Google Strategy-----------
   */

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
