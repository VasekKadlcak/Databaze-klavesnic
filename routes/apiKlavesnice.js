const store = require("../storage/klavesniceStore");

function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/klavesnice
  if (req.method === "GET" && url.pathname === "/api/klavesnice") {
    json(res, store.getAll());
    return true;
  }

  // GET /api/klavesnice/:id
  if (req.method === "GET" && url.pathname.startsWith("/api/klavesnice/")) {
    const id = Number(url.pathname.split("/").pop());
    const klavesnice = store.getById(id);
    klavesnice
      ? json(res, klavesnice)
      : chyba(res, "Klávesnice nenalezena", 404);
    return true;
  }

  // POST
  if (req.method === "POST" && url.pathname === "/api/klavesnice") {
    body(req, data => {
      const nova = store.create(data);
      json(res, nova, 201);
    });
    return true;
  }

  // PUT
  if (req.method === "PUT" && url.pathname.startsWith("/api/klavesnice/")) {
    const id = Number(url.pathname.split("/").pop());
    body(req, data => {
      const updated = store.update(id, data);
      updated
        ? json(res, updated)
        : chyba(res, "Klávesnice nenalezena", 404);
    });
    return true;
  }

  // DELETE
  if (req.method === "DELETE" && url.pathname.startsWith("/api/klavesnice/")) {
    const id = Number(url.pathname.split("/").pop());
    const removed = store.remove(id);
    removed
      ? json(res, removed)
      : chyba(res, "Klávesnice nenalezena", 404);
    return true;
  }

  return false;
}

function json(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function chyba(res, message, status = 400) {
  json(res, { chyba: message }, status);
}

function body(req, callback) {
  let data = "";
  req.on("data", chunk => (data += chunk));
  req.on("end", () => callback(JSON.parse(data)));
}

module.exports = handleApi;