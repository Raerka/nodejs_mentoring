import jwt from 'jsonwebtoken';

import { User } from '../models/users';
import { Product } from '../models/products';
import { City } from '../models/cities';

import authData from '../data/auth_data.json';

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
    .get((req, res) => {
      Product.find()
        .then(products => res.json(products))
        .catch(err => {
          res.send('Something went wrong. You can not get Products');
          throw err;
        });
    })
    .post((req, res) => {
      const product = new Product(req.body);
    
      product.save()
        .then(product => res.json(product))
        .catch(err => {
          res.send('Something went wrong. You can not add new product');
          throw err;
        });
    });
    
  //   /api/products/:id - GET - Return single product by current id
  //   /api/products/:id - DELETE - Delete single product by current id
  app.route('/api/products/:id')
    .get((req, res) => {
      Product.findById(req.params.id)
        .then(product => {
          product
            ? res.send(product)
            : res.send(`Product with id = ${req.params.id} is not found.`);
        })
        .catch(err => {
          res.send(`Product with id = ${req.params.id} is not found.`);
          throw err;
        });
    })
    .delete((req, res) => {
      Product.findByIdAndRemove(req.params.id)
        .then(product => res.send(`Product ${product} was deleted`))
        .catch(err => {
          res.send(`Product with id = ${req.params.id} is not found.`);
          throw err;
        });
    });

  //  /api/products/:id/reviews - Return all reviews for a single product by id
  app.get('/api/products/:id/reviews', (req, res) => {
    Product.findById(req.params.id)
      .then(product => {
        product
          ? res.send(product.reviews)
          : res.send(`Review for product with id = ${req.params.id} is not found.`);
      })
      .catch(err => {
        res.send(`Review for product with id = ${req.params.id} is not found.`);
        throw err;
      });
  });
  
  
  /**
   *   -----------User's Routes-----------
   */

  //   /api/users - Return all users
  app.get('/api/users', (req, res) => {
    User.find()
      .then(users => res.json(users))
      .catch(err => {
        res.send('Something went wrong. You can not get Users');
        throw err;
      });
  });
  
  //   /api/users/:id - Delete single user from database
  app.delete('/api/users/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
      .then(user => res.send(`User ${user} was deleted`))
      .catch(err => {
        res.send(`User with id = ${req.params.id} is not found.`);
        throw err;
      });
  });

  
  /**
   *   -----------City's Routes-----------
   */
  
  
  //   /api/cities - GET - Return all cities
  //   /api/cities - POST - Add new city and return it
  app.route('/api/cities')
    .get((req, res) => {
      City.find()
        .then(cities => res.json(cities))
        .catch(err => {
          res.send('Something went wrong. You can not get Cities');
          throw err;
        });
    })
  
    .post((req, res) => {
      const city = new City(req.body);
      
      city.save()
        .then(city => res.json(city))
        .catch(err => {
          res.send('Something went wrong. You can not add new city');
          throw err;
        });
    });
  
  //   /api/cities/:id - PUT - Update single product by current id if exists
  //                           or adds new city with the given id otherwise
  
  //   /api/cities/:id - DELETE - Delete single city by current id
  app.route('/api/cities/:id')
    .put((req, res) => {
      City.findByIdAndUpdate(req.params.id, req.body,{ upsert: true })
        .then(city => {
          city
            ? res.send(`City ${city} was updated with new data ${JSON.stringify(req.body)}`)
            : res.send(`City ${JSON.stringify(req.body)} was added to database`);
        })
        .catch(err => {
          res.send(`Can't update City with id = ${req.params.id} by data ${JSON.stringify(req.body)}.
          Please, check your request`);
          throw err;
        });
    })
    .delete((req, res) => {
      City.findByIdAndRemove(req.params.id)
        .then(city => res.send(`User ${city} was deleted`))
        .catch(err => {
          res.send(`City with id = ${req.params.id} is not found.`);
          throw err;
        });
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
