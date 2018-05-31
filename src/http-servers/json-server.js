import http from 'http';
import { Readable } from 'stream';
import { product } from './data';

const port = 3000;

/**
 * @description
 * Set Content-Type header to deal with JSON.
 * Read data from data.js file and send it as a JSON response.
 */
http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const rs = new Readable();
  rs.push(JSON.stringify(product, null, 2));
  rs.push(null);
  rs.pipe(res);
}).listen(port, (error) => {
  if (error) {
    console.log('Something bad happened', error); // eslint-disable-line no-console
    throw error;
  }
  console.log(`Server is listening on ${port}!`); // eslint-disable-line no-console
});
