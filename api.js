const http = require("http");
// Vzorová data – pole klávesnic
const klavesnice = [
{ id: 1, name: "Tomáš", age: 18 },
{ id: 2, name: "Karel", age: 19 }
];
const server = http.createServer((req, res) => {
// Endpoint GET /klavesnice – vrátí všechny klávesnice
if (req.url === "/klavesnice" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    
    return res.end(JSON.stringify(klavesnice));
}
// Endpoint GET /klavesnice/:id – vrátí konkrétní klávesnici podle ID
if (req.url.startsWith("/klavesnice/") && req.method === "GET") {
    const id = Number(req.url.split("/")[2]);
const klav = klavesnice.find((k) => k.id === id);
if (klav) {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(klav));
}
// Klávesnice nenalezena – 404
res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });

return res.end(JSON.stringify({ error: "Klávesnice nenalezena" }));
}
// Neznámý endpoint – 404
res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
res.end(JSON.stringify({ error: "Endpoint nenalezen" }));
});
server.listen(3001, () => {
console.log("API běží na http://localhost:3001");
});