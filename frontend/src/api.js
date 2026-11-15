// All HTTP requests live here; components never call fetch directly.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Shared helper: sends JSON and throws if the response is not 2xx
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  // 204 No Content has no body
  return res.status === 204 ? null : res.json();
}

export function fetchCars() {
  return request("/cars");
}

export function fetchReminders() {
  return request("/reminders");
}

export function createReminder(reminder) {
  return request("/reminders", { method: "POST", body: JSON.stringify(reminder) });
}

export function updateReminder(id, changes) {
  return request(`/reminders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteReminder(id) {
  return request(`/reminders/${id}`, { method: "DELETE" });
}