
import ReminderCard from "./ReminderCard.jsx";

export default function ReminderList({ reminders, cars }) {
  
  if (reminders.length === 0) {
    return <p className="empty">No deadlines yet.</p>;
  }

  return (
    <ul className="card-list">
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          car={cars.find((c) => c.name === reminder.car)}
        />
      ))}
    </ul>
  );
}
