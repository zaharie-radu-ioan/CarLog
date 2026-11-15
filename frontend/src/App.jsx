import { useEffect, useState } from "react";
import ReminderList from "./components/ReminderList.jsx";
import StatusSummary from "./components/StatusSummary.jsx";
import CarFilter from "./components/CarFilter.jsx";
import ReminderForm from "./components/ReminderForm.jsx";
import {
  createReminder,
  deleteReminder,
  fetchCars,
  fetchReminders,
  updateReminder,
} from "./api.js";
import { daysLeft, status } from "./utils/dates.js";

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

  // Server first, then state: only what was saved reaches the screen
  async function handleAdd(reminder) {
    const created = await createReminder(reminder); // the server returns the item with its id
    setReminders((prev) => [...prev, created]);
  }

  async function handleToggle(id) {
    const reminder = reminders.find((r) => r.id === id);
    try {
      const updated = await updateReminder(id, { done: !reminder.done });
      setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
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

          <ReminderForm cars={cars} onAdd={handleAdd} />
        </section>

        <section className="panel" id="list" aria-labelledby="list-title">
          <h2 className="section-title" id="list-title">My deadlines</h2>

          {/* The three states of a load: waiting, failed, succeeded */}
          {loading && (
            <p className="info" role="status" data-testid="loading">
              Loading your garage...
            </p>
          )}

          {error && (
            <div className="error" role="alert" data-testid="error">
              <p>
                Something went wrong: {error}. Is <code>npm run api</code> running?
              </p>
              <button className="btn-retry" type="button" onClick={handleRetry}>
                Try again
              </button>
            </div>
          )}

          {/* The list stays on screen even if a toggle or a delete fails */}
          {!loading && (
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