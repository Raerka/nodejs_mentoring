import http from 'http';
import fs from 'fs';
import path from 'path';

const port = 3000;

const requestHandler = (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  //todo Convert data to json!!!
  fs.createReadStream(`${__dirname}${path.sep}data.js`).pipe(response);
};

const server = http.createServer(requestHandler);

server.listen(port, (error) => {
  if (error) {
    return console.log('something bad happened', error); // eslint-disable-line no-console
  }
  console.log(`Server is listening on ${port}`); // eslint-disable-line no-console
});
