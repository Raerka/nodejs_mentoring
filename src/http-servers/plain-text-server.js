import http from 'http';

const port = 3000;

const requestHandler = (request, response) => {
  response.setHeader('Content-Type', 'text/plain');
  response.end('Hello World');
};

const server = http.createServer(requestHandler);

server.listen(port, (error) => {
  if (error) {
    return console.log('something bad happened', error); // eslint-disable-line no-console
  }
  console.log(`Server is listening on ${port}`); // eslint-disable-line no-console
});
