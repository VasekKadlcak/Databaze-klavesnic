const fs = require("fs");
const path = require("path");
const store = require("../storage/klavesniceStore");

function handlePages(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // ===============================
  // HLAVNÍ STRÁNKA – seznam klávesnic
  // ===============================
if (req.method === "GET" && url.pathname === "/") {
    const klavesnice = store.getAll();

  const cards = klavesnice
    .map((k) => `
      <div class="card">
        <div class="brand">${k.znacka} ${k.model}</div>
        <div class="type">${k.typ}</div>
        <div class="price">${k.cena} Kč</div>

        <div class="actions">
          <a href="/detail/${k.id}" class="detail">Detail</a>
          <a href="/edit/${k.id}" class="edit">Upravit</a>

          <form method="POST" action="/delete/${k.id}" style="display:inline;">
            <button class="delete" type="submit">X</button>
          </form>
        </div>
      </div>
  `)
  .join("");

    const template = fs.readFileSync(
      path.join(__dirname, "../views/index.html"),
      "utf-8"
    );

    const html = template.replace("{{klavesnice}}", cards);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return true;
  }

  // ===============================
  // DETAIL KLÁVESNICE
  // ===============================
  if (req.method === "GET" && url.pathname.startsWith("/detail/")) {
    const id = Number(url.pathname.split("/").pop());
    const klavesnice = store.getById(id);

    if (!klavesnice) {
      res.writeHead(404);
      res.end("Klávesnice nenalezena");
      return true;
    }

    const template = fs.readFileSync(
      path.join(__dirname, "../views/detail.html"),
      "utf-8"
    );

    let html = template
      .replace("{{znacka}}", klavesnice.znacka)
      .replace("{{model}}", klavesnice.model)
      .replace("{{typ}}", klavesnice.typ)
      .replace("{{cena}}", klavesnice.cena)
      .replace("{{id}}", klavesnice.id);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return true;
  }

  // ===============================
  // SMAZÁNÍ KLÁVESNICE
  // ===============================
  if (req.method === "POST" && url.pathname.startsWith("/delete/")) {
    const id = Number(url.pathname.split("/").pop());
    store.remove(id);

    res.writeHead(302, { Location: "/" });
    res.end();
    return true;
  }

  if (req.method === "GET" && url.pathname === "/nova") {
  const html = fs.readFileSync(
    path.join(__dirname, "../views/nova.html"),
    "utf-8"
  );

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  return res.end(html);
}
// ===============================
// VYTVOŘENÍ NOVÉ KLÁVESNICE
// ===============================
if (req.method === "POST" && url.pathname === "/nova") {
  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    const params = new URLSearchParams(body);

    const nova = {
      znacka: params.get("znacka"),
      model: params.get("model"),
      typ: params.get("typ"),
      cena: Number(params.get("cena"))
    };

    store.create(nova);

    res.writeHead(302, { Location: "/" });
    res.end();
  });

  return;
}
if (req.method === "GET" && url.pathname.startsWith("/edit/")) {
  const id = Number(url.pathname.split("/").pop());
  const klavesnice = store.getById(id);

  if (!klavesnice) {
    res.writeHead(404);
    return res.end("Klávesnice nenalezena");
  }

  const template = fs.readFileSync(
    path.join(__dirname, "../views/edit.html"),
    "utf-8"
  );

  //Edit klávesnice - předvyplnění formuláře

  let html = template
    .replace("{{id}}", klavesnice.id)
    .replace("{{znacka}}", klavesnice.znacka)
    .replace("{{model}}", klavesnice.model)
    .replace("{{cena}}", klavesnice.cena)
    .replace(
      "{{mechanicka}}",
      klavesnice.typ === "Mechanická" ? "selected" : ""
    )
    .replace(
      "{{membranova}}",
      klavesnice.typ === "Membránová" ? "selected" : ""
    )
    .replace(
      "{{opticka}}",
      klavesnice.typ === "Optická" ? "selected" : ""
    )
    .replace(
      "{{hybridni}}",
      klavesnice.typ === "Hybridní" ? "selected" : ""
    );
    

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  return res.end(html);
}

//edit klávesnice

if (req.method === "POST" && url.pathname.startsWith("/edit/")) {
  const id = Number(url.pathname.split("/").pop());

  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    const params = new URLSearchParams(body);

    const patch = {
      znacka: params.get("znacka"),
      model: params.get("model"),
      typ: params.get("typ"),
      cena: Number(params.get("cena"))
    };

    store.update(id, patch);

    res.writeHead(302, { Location: "/" });
    res.end();
  });

  return;
}

  // ===============================
  // 404
  // ===============================
  return false;
}

module.exports = handlePages;