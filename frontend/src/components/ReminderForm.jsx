import { useState } from "react";

const TYPES = [
  { value: "itp", label: "ITP" },
  { value: "rca", label: "RCA" },
  { value: "rovinieta", label: "Road tax" },
  { value: "revizie", label: "Service" },
];

const TITLE_MAX = 100;
const YEAR_MIN = 2000;
// A deadline can be at most 10 years ahead (ITP and RCA are yearly anyway)
const YEAR_MAX = new Date().getFullYear() + 10;

// Controlled form: React state is the source of truth for every field
export default function ReminderForm({ cars, onAdd }) {
  const [title, setTitle] = useState("");
  const [carId, setCarId] = useState("");
  const [type, setType] = useState(TYPES[0].value);
  const [expires, setExpires] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // Until the user picks a car, the first car from the server is selected
  const selectedCar = carId || (cars.length > 0 ? String(cars[0].id) : "");

  function validate() {
    const t = title.trim();
    if (t === "") return "The title is required.";
    if (t.length > TITLE_MAX) return `The title has at most ${TITLE_MAX} characters.`;
    if (selectedCar === "") return "Pick a car.";
    if (expires === "") return "The due date is required.";
    const year = Number(expires.slice(0, 4));
    if (year < YEAR_MIN || year > YEAR_MAX) {
      return `The due date must be between ${YEAR_MIN} and ${YEAR_MAX}.`;
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stops the page from reloading
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setSending(true);
    try {
      await onAdd({
        title: title.trim(),
        type,
        carId: Number(selectedCar),
        expires,
        done: false,
      });
      // Cleared only after the server saved the item
      setTitle("");
      setType(TYPES[0].value);
      setExpires("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate data-testid="form">
      <label className="form-label" htmlFor="title">Title</label>
      <input
        className="form-field"
        type="text"
        id="title"
        name="title"
        maxLength={TITLE_MAX}
        placeholder="Ex: Renew ITP"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-invalid={Boolean(error)}
        data-testid="form-title"
      />

      <label className="form-label" htmlFor="car">Car</label>
      <select
        className="form-field"
        id="car"
        name="car"
        value={selectedCar}
        onChange={(e) => setCarId(e.target.value)}
        disabled={cars.length === 0}
        data-testid="form-carId"
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
        data-testid="form-type"
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
        value={expires}
        onChange={(e) => setExpires(e.target.value)}
        data-testid="form-expires"
      />

      {error && (
        <p className="form-error" data-testid="form-error">
          {error}
        </p>
      )}

      <button className="button" type="submit" disabled={sending} data-testid="form-submit">
        {sending ? "Saving..." : "Add deadline"}
      </button>
    </form>
  );
}