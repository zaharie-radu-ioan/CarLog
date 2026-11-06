
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";


async function getJson(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}

export function fetchReminders() {
  return getJson("/reminders");
}

export function fetchCars() {
  return getJson("/cars");
}