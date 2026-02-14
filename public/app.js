async function api(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw { status: res.status, data };
  return data;
}

// CREATE (POST /api/users)
const createForm = document.getElementById("createForm");
if (createForm) {
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(createForm);
    const payload = { name: fd.get("name"), age: Number(fd.get("age")) };

    const msg = document.getElementById("createMsg");
    try {
      await api("/api/users", { method: "POST", body: JSON.stringify(payload) });
      window.location.reload();
    } catch (err) {
      msg.textContent = "Chyba: " + JSON.stringify(err.data);
    }
  });
}

// EDIT (PUT /api/users/:id)
const editForm = document.getElementById("editForm");
if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = editForm.dataset.id;
    const fd = new FormData(editForm);
    const payload = { name: fd.get("name"), age: Number(fd.get("age")) };

    const msg = document.getElementById("editMsg");
    try {
      await api(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      window.location.href = `/user/${id}`;
    } catch (err) {
      msg.textContent = "Chyba: " + JSON.stringify(err.data);
    }
  });
}

// DELETE tlačítka (DELETE /api/users/:id)
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-delete-id]");
  if (!btn) return;

  const id = btn.dataset.deleteId;
  if (!confirm("Opravdu smazat uživatele #" + id + "?")) return;

  try {
    await api(`/api/users/${id}`, { method: "DELETE" });
    window.location.href = "/";
  } catch (err) {
    alert("Chyba: " + JSON.stringify(err.data));
  }
});
