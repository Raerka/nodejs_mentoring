import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import express from 'express';
import bodyParser from 'body-parser';
import { cookieParser } from './middlewares/cookie-parser';
import { queryParser } from './middlewares/query-parser';

import products from './data/products.json';
import users from './data/users.json';

export const app = express();

app.use(cookieParser);
app.use(queryParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  / GET Return 'Hello World!' string
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//  /api/products GET Return ALL products
//  /api/products POST Add NEW product and return it
app.route('/api/products')
  .get((req, res) => {
    res.send(products);
  })
  .post((req, res) => {
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
app.get('/api/products/:id', (req, res) => {
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
app.get('/api/products/:id/reviews', (req, res) => {
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
app.get('/api/users', (req, res) => {
  res.json(users);
});
