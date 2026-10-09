export default function CategoryFilter({
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div
      aria-label="Filter by category"
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        margin: "16px 0",
      }}
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={selectedCategory === category}
          onClick={() => setSelectedCategory(category)}
          style={{
            padding: "8px 12px",
            border: "1px solid var(--border-color)",
            borderRadius: "4px",
            cursor: "pointer",
            background:
              selectedCategory === category ? "var(--accent)" : "transparent",
            color:
              selectedCategory === category
                ? "var(--accent-contrast, #fff)"
                : "inherit",
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
