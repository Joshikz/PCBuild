export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      placeholder="Search products..."
      style={{
        padding: "8px 12px",
        borderRadius: "4px",
        border: "1px solid var(--border-color)",
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        width: "100%",
        maxWidth: "300px",
      }}
    />
  );
}
