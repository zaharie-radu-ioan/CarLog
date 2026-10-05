"use strict";

const TYPES = ["itp", "rca", "rovinieta", "revizie"];

const reminders = [
  { id: 1, title: "ITP Dacia Logan", type: "itp", expires: "2026-11-20", done: false },
  { id: 2, title: "RCA Dacia Logan", type: "rca", expires: "2027-03-01", done: true },
  { id: 3, title: "Rovinietă Dacia Logan", type: "rovinieta", expires: "2026-10-15", done: false },
];


function parseIsoDate(text) {
  if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return null;
  }
  const [y, m, d] = text.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const valid =
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d;
  return valid ? date : null;
}

function nextId(list) {
  return list.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}


function listTitles(list) {
  return list.map((r) => r.title);
}

function countActive(list) {
  return list.filter((r) => !r.done).length;
}

function searchByTitle(list, text) {
  const q = text.trim().toLowerCase();
  return list.filter(
    (r) => r.title.toLowerCase().includes(q) || r.type.includes(q)
  );
}

function addReminder(list, title, type = "itp", expires = "") {
  const cleanTitle = String(title ?? "").trim();
  if (cleanTitle === "") {
    console.log("Titlul nu poate fi gol.");
    return list;
  }
  if (!TYPES.includes(type)) {
    console.log("Tip invalid:", type);
    return list;
  }
  if (parseIsoDate(expires) === null) {
    console.log("Data de expirare invalidă (format AAAA-LL-ZZ):", expires);
    return list;
  }
  const created = {
    id: nextId(list),
    title: cleanTitle,
    type,
    expires,
    done: false,
  };
  return [...list, created];
}

function toggleDone(list, id) {
  return list.map((r) => (r.id === id ? { ...r, done: !r.done } : r));
}

function deleteReminder(list, id) {
  return list.filter((r) => r.id !== id);
}


function findById(list, id) {
  return list.find((r) => r.id === id);
}

function daysLeft(expires, today = new Date()) {
  const end = parseIsoDate(expires);
  if (end === null) return null;
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((end.getTime() - start) / 86400000);
}

function withDaysLeft(list, today = new Date()) {
  return list.map((r) => ({ ...r, daysLeft: daysLeft(r.expires, today) }));
}

function sortByExpiry(list) {
  return [...list].sort((a, b) => a.expires.localeCompare(b.expires));
}

function filterByType(list, type) {
  return list.filter((r) => r.type === type);
}

// Active reminders that expire within `days` days (already expired ones included).
function expiringSoon(list, days = 30, today = new Date()) {
  return list.filter((r) => !r.done && daysLeft(r.expires, today) <= days);
}


const TODAY = new Date(2026, 9, 5); 

function check(label, ok) {
  if (ok) {
    console.log("✓", label);
  } else {
    console.error("✗", label);
  }
}

console.log("--- Citire ---");
console.log("Titluri:", listTitles(reminders).join(", "));
console.log("Active:", countActive(reminders));
console.log("Căutare 'itp':", listTitles(searchByTitle(reminders, "itp")).join(", "));

console.log("--- Adăugare ---");
let list = addReminder(reminders, "Revizie Dacia Logan", "revizie", "2027-01-10");
console.log("Lista nouă:", list.length, "elemente");
console.log("Originalul a rămas cu:", reminders.length, "elemente");

console.log("--- Modificare și ștergere ---");
list = toggleDone(list, 1);
console.log("După bifarea id 1, active:", countActive(list));
list = deleteReminder(list, 3);
console.log("După ștergerea id 3:", listTitles(list).join(", "));
list = addReminder(list, "RCA Skoda Octavia", "rca", "2027-06-30");
console.log("Id nou după ștergere:", list[list.length - 1].id, "(fără duplicate)");

console.log("--- Validare ---");
addReminder(list, "   ", "itp", "2026-12-01");
addReminder(list, "Ceva", "urgenta", "2026-12-01");
addReminder(list, "Ceva", "itp", "2026-02-31");

console.log("--- Funcții suplimentare ---");
console.log(
  "Zile rămase:",
  withDaysLeft(reminders, TODAY).map((r) => `${r.title}: ${r.daysLeft}`).join(" | ")
);
console.log("Sortat după expirare:", listTitles(sortByExpiry(reminders)).join(", "));
console.log("Doar RCA:", listTitles(filterByType(reminders, "rca")).join(", "));
console.log(
  "Expiră în 30 de zile:",
  listTitles(expiringSoon(reminders, 30, TODAY)).join(", ")
);

console.log("--- Verificări automate ---");
const frozen = Object.freeze(reminders.map((r) => Object.freeze({ ...r })));
let frozenOk = true;
try {
  addReminder(frozen, "Test", "itp", "2026-12-01");
  toggleDone(frozen, 1);
  deleteReminder(frozen, 2);
  sortByExpiry(frozen);
  withDaysLeft(frozen, TODAY);
} catch (e) {
  frozenOk = false; // in strict mode, mutating a frozen object throws
}
check("niciuna dintre funcții nu modifică datele primite", frozenOk);
check("array-ul inițial are încă 3 elemente", reminders.length === 3);
check("countActive = 2 pe datele de test", countActive(reminders) === 2);
check("căutarea 'ITP' găsește și 'itp' (fără diferență mare/mică)",
  searchByTitle(reminders, "ITP").length === 1);
check("id nou = maxim + 1", nextId(reminders) === 4);
check("id fără duplicate după ștergere", nextId(deleteReminder(reminders, 2)) === 4);
check("zile până la ITP = 46", daysLeft("2026-11-20", TODAY) === 46);
check("rovinieta expiră în 10 zile", daysLeft("2026-10-15", TODAY) === 10);
check("dată expirată => număr negativ", daysLeft("2026-10-01", TODAY) === -4);
check("dată inexistentă respinsă", parseIsoDate("2026-02-31") === null);
check("adăugarea invalidă întoarce aceeași listă", addReminder(reminders, "", "itp", "2026-12-01") === reminders);