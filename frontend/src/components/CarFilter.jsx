import { daysLeft, relativeDays } from "../utils/dates.js";

export default function CarFilter({ cars, reminders, selected, onSelect }) {
  return (
    <ul className="garage">
      <li>
        <button
          type="button"
          className="garage-car"
          aria-pressed={selected === "all"}
          onClick={() => onSelect("all")}
        >
          <span className="garage-name">All cars</span>
          <span className="garage-meta">{cars.length} in the garage</span>
        </button>
      </li>

      {cars.map((car) => {
        // The closest deadline of this car that is not done yet
        const next = reminders
          .filter((r) => r.carId === car.id && !r.done)
          .sort((a, b) => a.expires.localeCompare(b.expires))[0];

        return (
          <li key={car.id}>
            <button
              type="button"
              className="garage-car"
              aria-pressed={selected === car.id}
              onClick={() => onSelect(car.id)}
            >
              <span className="garage-name">{car.name}</span>
              <span className="garage-plate">{car.plate}</span>
              <span className="garage-meta">
                {car.year} · {car.fuel} · {car.km.toLocaleString("ro-RO")} km
              </span>
              <span className="garage-next">
                {!next
                  ? "Nothing due"
                  : daysLeft(next.expires) < 0
                    ? `Overdue: ${next.title}, ${relativeDays(daysLeft(next.expires))}`
                    : `Next: ${next.title} ${relativeDays(daysLeft(next.expires))}`}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}