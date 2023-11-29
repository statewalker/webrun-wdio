import http from 'http';

const port = process.env.PORT || 5000;
let numVisits = 0;

  http
  .createServer((req, res) => {
    res
      .writeHead(200)
      .end('Number of visits is: ' + numVisits + '.')
    numVisits++
  })
  .listen(port, () => console.log(`Web application is listening on port ${port}`))
