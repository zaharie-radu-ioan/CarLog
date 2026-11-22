import { useEffect, useState } from "react";
import ReminderList from "../components/ReminderList.jsx";
import StatusSummary from "../components/StatusSummary.jsx";
import CarFilter from "../components/CarFilter.jsx";
import ReminderForm from "../components/ReminderForm.jsx";
import {
  createReminder,
  deleteReminder,
  fetchCars,
  fetchReminders,
  updateReminder,
} from "../api.js";
import { daysLeft, status } from "../utils/dates.js";
import styles from "./RemindersPage.module.css";

// The main page ("/"): the form and the list. Same logic as App in stage 7.
export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [carFilter, setCarFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Runs after the first render, and again only when reloadKey changes
  useEffect(() => {
    let ignore = false; // do not set state if the page is gone meanwhile

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

  return (
    <div className={styles.stack}>
      <section className="panel" id="add" aria-labelledby="add-title">
        <h2 className="section-title" id="add-title">Add a deadline</h2>

        <ReminderForm cars={cars} onAdd={handleAdd} />
      </section>

      <section className="panel" id="list" aria-labelledby="list-title">
        <div className={styles.listHead}>
          <h2 className="section-title" id="list-title">My deadlines</h2>
          {/* The counter moved here from the header, which is now shared by every page */}
          {!loading && (
            <p className={styles.count}>
              {cars.length} cars, {reminders.length} items, {active} active
            </p>
          )}
        </div>

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
    </div>
  );
}
