import { useState } from "react";
import ReminderList from "./components/ReminderList.jsx";

const CARS = [
  { name: "Dacia Duster", plate: "B 123 ABC" },
  { name: "Volkswagen Golf", plate: "CJ 45 XYZ" },
];

const TYPES = [
  { value: "itp", label: "ITP" },
  { value: "rca", label: "RCA" },
  { value: "rovinieta", label: "Road tax" },
  { value: "revizie", label: "Service" },
];

const INITIAL_REMINDERS = [
  { id: 1, title: "ITP Dacia Logan", type: "itp", expires: "2026-11-20", done: false },
  { id: 2, title: "RCA Dacia Logan", type: "rca", expires: "2027-03-01", done: true },
  { id: 3, title: "Rovinietă Dacia Logan", type: "rovinieta", expires: "2026-10-15", done: false },
];

// Starting theme: the one set in the operating system
function initialTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [title, setTitle] = useState("");
  const [car, setCar] = useState(CARS[0].name);
  const [type, setType] = useState(TYPES[0].value);
  const [date, setDate] = useState("");
  const [theme, setTheme] = useState(initialTheme);

  // Derived value: recalculated on every render, never kept in state
  const active = reminders.filter((r) => !r.done).length;

  // Immutable updates: a new list, and a new object for the changed item
  function handleToggle(id) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  }

  function handleDelete(id) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function handleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (title.trim() === "" || date === "") return;
    const item = { title: title.trim(), type, car, expires: date, done: false };
    setReminders((prev) => {
      const nextId = prev.reduce((max, r) => Math.max(max, r.id), 0) + 1;
      return [...prev, { id: nextId, ...item }];
    });
    setTitle("");
    setDate("");
  }

  return (
    <>
      <header className="app-header">
        <span className="app-logo" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="2.2" />
            <path d="M3.2 10.5l6.6.7M20.8 10.5l-6.6.7M12 14.2V21" />
          </svg>
        </span>
        <h1 className="app-title">CarLog</h1>
        <p className="app-description">
          Keep track of ITP, RCA, road tax and service for your cars.
        </p>
        <p className="app-summary">
          {reminders.length} items, {active} active
        </p>
        <button
          className="theme-toggle"
          type="button"
          onClick={handleTheme}
          aria-pressed={theme === "dark"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {/* The icon shows the mode you switch to: sun in dark mode, moon in light mode */}
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
      </header>

      <main className="container">
        <section className="panel" id="add" aria-labelledby="add-title">
          <h2 className="section-title" id="add-title">Add a deadline</h2>

          <form className="form" onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="title">Title</label>
            <input
              className="form-field"
              type="text"
              id="title"
              name="title"
              maxLength={100}
              placeholder="Ex: Renew ITP"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="form-label" htmlFor="car">Car</label>
            <select
              className="form-field"
              id="car"
              name="car"
              value={car}
              onChange={(e) => setCar(e.target.value)}
            >
              {CARS.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            <label className="form-label" htmlFor="type">Type</label>
            <select
              className="form-field"
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <label className="form-label" htmlFor="date">Due date</label>
            <input
              className="form-field"
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button className="button" type="submit">Add deadline</button>
          </form>
        </section>

        <section className="panel" id="list" aria-labelledby="list-title">
          <h2 className="section-title" id="list-title">My deadlines</h2>

          <ReminderList
            reminders={reminders}
            cars={CARS}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="app-footer">
        <nav className="app-nav" aria-label="Main">
          <a className="nav-link" href="#list">Deadlines</a>
          <a className="nav-link" href="#add">Add</a>
        </nav>
        <p className="footer-note">CarLog, Web Technologies project</p>
      </footer>
    </>
  );
}