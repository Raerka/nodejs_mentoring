import http from 'http';
import fs from 'fs';
import path from 'path';
import through from 'through2';

const port = 3000;

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  fs.createReadStream(`${__dirname}${path.sep}index.html`)
    .pipe(through((data, enc, cb) => { cb(null, data.toString().replace('{message}', 'Hello World')); }))
    .pipe(res);
}).listen(port, (error) => {
  if (error) {
    console.log('something bad happened', error); // eslint-disable-line no-console
    throw error;
  }
  console.log(`Server is listening on ${port}`); // eslint-disable-line no-console
});
