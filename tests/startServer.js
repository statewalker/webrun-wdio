import http from 'http';
import fs from "fs";
import path from "path";

export async function startServer({ rootDir, port = 8080 }) {
  return new Promise((resolve, reject) => {
    try {
      const server = http.createServer((request, response) => {
        try {
          let filePath = '.' + request.url;
          if (filePath[filePath.length - 1] === '/') {
            filePath += 'index.html';
          }
          let extname = path.extname(filePath);
          let contentType = 'text/html';
          switch (extname) {
            case '.js':
              contentType = 'text/javascript';
              break;
            case '.css':
              contentType = 'text/css';
              break;
            case '.json':
              contentType = 'application/json';
              break;
            case '.png':
              contentType = 'image/png';
              break;
            case '.jpg':
              contentType = 'image/jpg';
              break;
            case '.wav':
              contentType = 'audio/wav';
              break;
          }
          const fullPath = path.join(rootDir, filePath);
          const content = fs.readFileSync(fullPath);
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content);
        } catch (error) {
          response.writeHead(500, { 'Content-Type': "application/json" });
          response.end(JSON.stringify({ error }), 'utf-8');
        }
      });
      server.listen(port);
      resolve(() => server.close());
    } catch (error) {
      reject(error);
    }
  });
}
