const TILES = [
  { value: "overdue", label: "Overdue" },
  { value: "soon", label: "Due in 30 days" },
  { value: "ok", label: "Up to date" },
];

export default function StatusSummary({ counts, selected, onSelect }) {
  return (
    <div className="summary">
      {TILES.map((tile) => (
        <button
          key={tile.value}
          type="button"
          className={`summary-tile summary-${tile.value}`}
          aria-pressed={selected === tile.value}
          onClick={() => onSelect(selected === tile.value ? "all" : tile.value)}
        >
          <span className="summary-number">{counts[tile.value]}</span>
          <span className="summary-label">{tile.label}</span>
        </button>
      ))}
    </div>
  );
}