import ReminderCard from "./ReminderCard.jsx";
import styles from "./ReminderList.module.css";

export default function ReminderList({ reminders, cars, onToggle, onDelete }) {
  if (reminders.length === 0) {
    return (
      <p className="empty" data-testid="empty">
        No deadlines match this filter.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          car={cars.find((c) => c.id === reminder.carId)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
