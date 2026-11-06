import { useEffect, useState } from "react";
import ReminderList from "./components/ReminderList.jsx";
import StatusSummary from "./components/StatusSummary.jsx";
import CarFilter from "./components/CarFilter.jsx";
import { fetchCars, fetchReminders } from "./api.js";
import { daysLeft, status } from "./utils/dates.js";

const TYPES = [
  { value: "itp", label: "ITP" },
  { value: "rca", label: "RCA" },
  { value: "rovinieta", label: "Road tax" },
  { value: "revizie", label: "Service" },
];

function initialTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [reminders, setReminders] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [carFilter, setCarFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [carId, setCarId] = useState("");
  const [type, setType] = useState(TYPES[0].value);
  const [date, setDate] = useState("");
  const [theme, setTheme] = useState(initialTheme);

  // Runs after the first render, and again only when reloadKey changes
  useEffect(() => {
    let ignore = false; // do not set state if the component is gone meanwhile

    async function load() {
      try {
        const [carsData, remindersData] = await Promise.all([fetchCars(), fetchReminders()]);
        if (!ignore) {
          setCars(carsData);
          setReminders(remindersData);
          if (carsData.length > 0) setCarId(String(carsData[0].id));
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function handleRetry() {
    setError(null);
    setLoading(true);
    setReloadKey((k) => k + 1);
  }

  const active = reminders.filter((r) => !r.done).length;
  const counts = { overdue: 0, soon: 0, ok: 0 };
  for (const r of reminders) {
    if (!r.done) counts[status(r)] += 1;
  }

  const visible = reminders
    .filter((r) => carFilter === "all" || r.carId === carFilter)
    .filter((r) => statusFilter === "all" || status(r) === statusFilter)
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return daysLeft(a.expires) - daysLeft(b.expires);
    });


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
    if (title.trim() === "" || date === "" || carId === "") return;
    // Stays local in stage 6; stage 7 sends it to the server with POST
    const item = { title: title.trim(), type, carId: Number(carId), expires: date, done: false };
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
          {loading
            ? "Loading..."
            : `${cars.length} cars, ${reminders.length} items, ${active} active`}
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
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              disabled={cars.length === 0}
            >
              {cars.length === 0 && <option value="">No cars loaded</option>}
              {cars.map((c) => (
                <option key={c.id} value={c.id}>{c.name}, {c.plate}</option>
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

          {/* The three states of a load: waiting, failed, succeeded */}
          {loading && (
            <p className="info" role="status">Loading your garage...</p>
          )}

          {error && (
            <div className="error" role="alert">
              <p>
                Could not load the data: {error}. Is <code>npm run api</code> running?
              </p>
              <button className="btn-retry" type="button" onClick={handleRetry}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <StatusSummary
                counts={counts}
                selected={statusFilter}
                onSelect={setStatusFilter}
              />
              <CarFilter
                cars={cars}
                reminders={reminders}
                selected={carFilter}
                onSelect={setCarFilter}
              />
              <ReminderList
                reminders={visible}
                cars={cars}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            </>
          )}
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