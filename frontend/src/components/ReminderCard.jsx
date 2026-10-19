// A single deadline from the list, received through props.

// Values in the data stay as they are (itp, rovinieta...); these maps give
// the text shown on screen and the CSS class of the badge.
const TYPE_LABELS = { itp: "ITP", rca: "RCA", rovinieta: "Road tax", revizie: "Service" };
const TYPE_BADGES = {
  itp: "badge-itp",
  rca: "badge-rca",
  rovinieta: "badge-road-tax",
  revizie: "badge-service",
};

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

// The card's look depends on the data: done, overdue, due soon or ok.
function statusClass(reminder) {
  if (reminder.done) return "card-done";
  const days = daysLeft(reminder.expires);
  if (days < 0) return "card-overdue";
  if (days <= 30) return "card-soon";
  return "card-ok";
}

export default function ReminderCard({ reminder, car }) {
  const days = daysLeft(reminder.expires);

  return (
    <li className={`card ${statusClass(reminder)}`}>
      <div className="card-info">
        <h3 className="card-title">{reminder.title}</h3>
        <span className={`badge ${TYPE_BADGES[reminder.type]}`}>{TYPE_LABELS[reminder.type]}</span>
        {car && (
          <p className="card-car">
            {car.name}, {car.plate}
          </p>
        )}
        <p className="card-date">
          {reminder.done ? "Done, planned for " : "Expires on "}
          <time dateTime={reminder.expires}>{formatDate(reminder.expires)}</time>
        </p>
      </div>
      <p className="card-days">
        {reminder.done ? (
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
}
