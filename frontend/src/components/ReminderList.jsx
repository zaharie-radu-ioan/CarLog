import ReminderCard from "./ReminderCard.jsx";

export default function ReminderList({ reminders, cars, onToggle, onDelete }) {
  if (reminders.length === 0) {
    return <p className="empty">No deadlines match this filter.</p>;
  }

  return (
    <ul className="card-list">
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