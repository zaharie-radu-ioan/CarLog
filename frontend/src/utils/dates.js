
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function daysLeft(expires, today = new Date()) {
  const [y, m, d] = expires.split("-").map(Number);
  const end = Date.UTC(y, m - 1, d);
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((end - start) / 86400000);
}

export function formatDate(expires) {
  const [y, m, d] = expires.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function status(reminder) {
  if (reminder.done) return "done";
  const days = daysLeft(reminder.expires);
  if (days < 0) return "overdue";
  if (days <= 30) return "soon";
  return "ok";
}

export function relativeDays(days) {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days > 0) return `in ${days} days`;
  if (days === -1) return "yesterday";
  return `${-days} days ago`;
}