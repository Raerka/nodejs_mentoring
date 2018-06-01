import http from 'http';

const port = 3000;

/**
 * @description
 * Simple echo server.
 * Get request and pipe it to the response.
 */
http.createServer((req, res) => req.pipe(res))
  .listen(port, (error) => {
    if (error) {
      console.log('Something bad happened', error); // eslint-disable-line no-console
      throw error;
    }
    console.log(`Server is listening on ${port}!`); // eslint-disable-line no-console
  });
