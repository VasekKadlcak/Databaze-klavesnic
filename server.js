const http = require("http");
const handleApi = require("./routes/apiKlavesnice");
const handlePages = require("./routes/pages");

const server = http.createServer((req, res) => {
  // 1) API
  const apiHandled = handleApi(req, res);
  if (apiHandled !== false) return;

  // 2) Pages + public
  const pageHandled = handlePages(req, res);
  if (pageHandled !== false) return;

  // 3) fallback 404
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(3001, () => {
  console.log("Server běží na http://localhost:3001");
});