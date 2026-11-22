import styles from "./StatusSummary.module.css";

const TILES = [
  { value: "overdue", label: "Overdue" },
  { value: "soon", label: "Due in 30 days" },
  { value: "ok", label: "Up to date" },
];

export default function StatusSummary({ counts, selected, onSelect }) {
  return (
    <div className={styles.summary}>
      {TILES.map((tile) => (
        <button
          key={tile.value}
          type="button"
          className={`${styles.tile} ${styles[tile.value]}`}
          aria-pressed={selected === tile.value}
          onClick={() => onSelect(selected === tile.value ? "all" : tile.value)}
        >
          <span className={styles.number}>{counts[tile.value]}</span>
          <span className={styles.label}>{tile.label}</span>
        </button>
      ))}
    </div>
  );
}