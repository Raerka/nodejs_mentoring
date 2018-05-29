import http from 'http';

const port = 3000;

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
}).listen(port, (error) => {
  if (error) {
    console.log('something bad happened', error); // eslint-disable-line no-console
    throw error;
  }
  console.log(`Server is listening on ${port}`); // eslint-disable-line no-console
});
