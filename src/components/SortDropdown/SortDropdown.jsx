export default function SortDropdown({ sortBy, setSortBy }) {
  return (
    <select
      value={sortBy}
      onChange={(event) => setSortBy(event.target.value)}
      style={{
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid var(--border-color)",
        background: "var(--bg-card)",
        color: "var(--text-primary)",
      }}
    >
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Name: A to Z</option>
      <option value="name-desc">Name: Z to A</option>
    </select>
  );
}
