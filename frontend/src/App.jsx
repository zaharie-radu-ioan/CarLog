import { useState } from "react";


const CARS = [
  { name: "Dacia Duster", plate: "B 123 ABC" },
  { name: "Volkswagen Golf", plate: "CJ 45 XYZ" },
];

const TYPES = [
  { value: "itp", label: "ITP", badge: "badge-itp" },
  { value: "rca", label: "RCA", badge: "badge-rca" },
  { value: "rovinieta", label: "Road tax", badge: "badge-road-tax" },
  { value: "revizie", label: "Service", badge: "badge-service" },
];

const INITIAL_REMINDERS = [
  { id: 1, title: "ITP Dacia Logan", type: "itp", expires: "2026-11-20", done: false },
  { id: 2, title: "RCA Dacia Logan", type: "rca", expires: "2027-03-01", done: true },
  { id: 3, title: "Rovinietă Dacia Logan", type: "rovinieta", expires: "2026-10-15", done: false },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function daysLeft(expires, today = new Date()) {
  const [y, m, d] = expires.split("-").map(Number);
  const end = Date.UTC(y, m - 1, d);
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((end - start) / 86400000);
}

function formatDate(expires) {
  const [y, m, d] = expires.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function statusClass(reminder) {
  if (reminder.done) return "card-done";
  const days = daysLeft(reminder.expires);
  if (days < 0) return "card-overdue";
  if (days <= 30) return "card-soon";
  return "card-ok";
}

export default function App() {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [title, setTitle] = useState("");
  const [car, setCar] = useState(CARS[0].name);
  const [type, setType] = useState(TYPES[0].value);
  const [date, setDate] = useState("");

  const active = reminders.filter((r) => !r.done).length;

  function handleSubmit(event) {
    event.preventDefault();
    if (title.trim() === "" || date === "") return;
    const nextId = reminders.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    setReminders([
      ...reminders,
      { id: nextId, title: title.trim(), type, car, expires: date, done: false },
    ]);
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

          <ul className="card-list">
            {reminders.map((r) => {
              const days = daysLeft(r.expires);
              const typeInfo = TYPES.find((t) => t.value === r.type);
              const carInfo = CARS.find((c) => c.name === r.car);
              return (
                <li key={r.id} className={`card ${statusClass(r)}`}>
                  <div className="card-info">
                    <h3 className="card-title">{r.title}</h3>
                    <span className={`badge ${typeInfo.badge}`}>{typeInfo.label}</span>
                    {carInfo && <p className="card-car">{r.car}, {carInfo.plate}</p>}
                    <p className="card-date">
                      {r.done ? "Done, planned for " : "Expires on "}
                      <time dateTime={r.expires}>{formatDate(r.expires)}</time>
                    </p>
                  </div>
                  <p className="card-days">
                    {r.done ? (
                      <span className="days-number">Done</span>
                    ) : (
                      <>
                        <span className="days-number">{Math.abs(days)}</span>{" "}
                        {days < 0 ? "days overdue" : days === 1 ? "day left" : "days left"}
                      </>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
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