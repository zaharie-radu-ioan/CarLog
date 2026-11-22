import { Link } from "react-router-dom";
import { TYPE_BADGES, TYPE_LABELS } from "../constants.js";
import { daysLeft, formatDate, status } from "../utils/dates.js";
import styles from "./ReminderCard.module.css";

export default function ReminderCard({ reminder, car, onToggle, onDelete }) {
  const days = daysLeft(reminder.expires);

  // The card's look depends on the data: styles.done, styles.overdue, styles.soon or styles.ok
  const cardClass = `${styles.card} ${styles[status(reminder)]}`;

  return (
    <li className={cardClass} data-testid="item" data-id={reminder.id}>
      {/* A div, not a label: the title is now a link, so a click on it opens the page */}
      <div className={styles.main}>
        <input
          className={styles.check}
          type="checkbox"
          checked={reminder.done}
          onChange={() => onToggle(reminder.id)}
          aria-label={`Mark ${reminder.title} as done`}
          data-testid="item-toggle"
        />
        <div className={styles.info}>
          <h3 className={styles.title}>
            <Link to={`/reminders/${reminder.id}`} className={styles.titleLink} data-testid="item-link">
              {reminder.title}
            </Link>
          </h3>
          {/* Global classes (badge) stay as text; module classes are written styles.name */}
          <span className={`badge ${TYPE_BADGES[reminder.type]}`}>{TYPE_LABELS[reminder.type]}</span>
          {car && (
            <p className={styles.car}>
              {car.name}, {car.plate}
            </p>
          )}
          {reminder.notes && <p className={styles.notes}>{reminder.notes}</p>}
          <p className={styles.date}>
            {reminder.done ? "Done, planned for " : "Expires on "}
            <time dateTime={reminder.expires}>{formatDate(reminder.expires)}</time>
          </p>
        </div>
      </div>

      <div className={styles.side}>
        <p className={styles.days}>
          {reminder.done ? (
            <span className={styles.daysNumber}>Done</span>
          ) : (
            <>
              <span className={styles.daysNumber}>{Math.abs(days)}</span>{" "}
              {days < 0 ? "days overdue" : days === 1 ? "day left" : "days left"}
            </>
          )}
        </p>
        <button
          className="btn-danger"
          type="button"
          onClick={() => onDelete(reminder.id)}
          aria-label={`Delete ${reminder.title}`}
          data-testid="item-delete"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
