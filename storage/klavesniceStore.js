const fs = require("fs");
const path = require("path");

const SOUBOR = path.join(__dirname, "..", "data", "klavesnice.json");

function nacti() {
  try {
    const raw = fs.readFileSync(SOUBOR, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.log("❌ Chyba při čtení klavesnice.json:", e.message);
    return [];
  }
}

function uloz(data) {
  fs.writeFileSync(SOUBOR, JSON.stringify(data, null, 2), "utf-8");
}

function getAll() {
  return nacti();
}

function getById(id) {
  return nacti().find(k => k.id === id) || null;
}

function create({ znacka, model, typ, cena }) {
  const data = nacti();
  const newId = data.length ? Math.max(...data.map(k => k.id)) + 1 : 1;

  const klavesnice = {
    id: newId,
    znacka,
    model,
    typ,
    cena
  };

  data.push(klavesnice);
  uloz(data);
  return klavesnice;
}

function update(id, patch) {
  const data = nacti();
  const idx = data.findIndex(k => k.id === id);
  if (idx === -1) return null;

  Object.assign(data[idx], patch);
  uloz(data);
  return data[idx];
}

function remove(id) {
  const data = nacti();
  const idx = data.findIndex(k => k.id === id);
  if (idx === -1) return null;

  const odebrana = data.splice(idx, 1)[0];
  uloz(data);
  return odebrana;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};