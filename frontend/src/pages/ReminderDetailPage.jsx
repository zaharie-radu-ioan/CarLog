import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCar, fetchReminder } from "../api.js";
import { STATUS_LABELS, TYPE_BADGES, TYPE_LABELS } from "../constants.js";
import { daysLeft, formatDate, relativeDays, status } from "../utils/dates.js";
import styles from "./ReminderDetailPage.module.css";

// The page of one deadline: /reminders/3
export default function ReminderDetailPage() {
  const { id } = useParams(); // text from the address, e.g. "3"
  const [reminder, setReminder] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs again when the id in the address changes ([id], not [])
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        // First the deadline, then its car (we need carId from the deadline)
        const reminderData = await fetchReminder(id);
        const carData = await fetchCar(reminderData.carId);
        if (!ignore) {
          setReminder(reminderData);
          setCar(carData);
          setError(null); // an error from a previous id is no longer true
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
  }, [id]);

  if (loading) {
    return (
      <p className="info" role="status" data-testid="loading">
        Loading the deadline...
      </p>
    );
  }

  // For /reminders/999 the server answers 404 and we show a message, not an empty page
  if (error) {
    return (
      <section className={`panel surface ${styles.detail}`}>
        <div className="error" role="alert" data-testid="error">
          <p>This deadline could not be loaded: {error}</p>
        </div>
        <Link to="/" className={styles.back}>
          Back to the list
        </Link>
      </section>
    );
  }

  const state = status(reminder);
  const days = daysLeft(reminder.expires);

  return (
    <section className={`panel surface ${styles.detail} ${styles[state]}`} data-testid="detail">
      <Link to="/" className={styles.back}>
        &larr; Back to the list
      </Link>

      <div className={styles.head}>
        <div>
          <h2 className={styles.title} data-testid="detail-title">
            {reminder.title}
          </h2>
          <span className={`badge ${TYPE_BADGES[reminder.type]}`}>{TYPE_LABELS[reminder.type]}</span>
        </div>

        {/* The big number, like on the card */}
        <p className={styles.days}>
          {reminder.done ? (
            <span className={styles.daysNumber}>Done</span>
          ) : (
            <>
              <span className={styles.daysNumber}>{Math.abs(days)}</span>
              {days < 0 ? "days overdue" : days === 1 ? "day left" : "days left"}
            </>
          )}
        </p>
      </div>

      {/* A definition list: dt is the name of the field, dd its value */}
      <dl className={styles.fields}>
        <dt>Status</dt>
        <dd>{STATUS_LABELS[state]}</dd>

        <dt>Expires on</dt>
        <dd>
          <time dateTime={reminder.expires}>{formatDate(reminder.expires)}</time> ({relativeDays(days)})
        </dd>

        <dt>Car</dt>
        <dd>
          {car.name} <span className={styles.plate}>{car.plate}</span>
        </dd>

        {/* Shown only here, they do not fit on the card */}
        <dt>Year</dt>
        <dd>{car.year}</dd>

        <dt>Fuel</dt>
        <dd>{car.fuel}</dd>

        <dt>Mileage</dt>
        <dd>{car.km.toLocaleString("ro-RO")} km</dd>

        <dt>Notes</dt>
        <dd>{reminder.notes || "No notes"}</dd>

        <dt>ID</dt>
        <dd>{reminder.id}</dd>
      </dl>
    </section>
  );
}
