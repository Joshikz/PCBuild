export default function StatCard({ title, value }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid var(--border, #ddd)",
        borderRadius: "8px",
        flex: 1,
        background: "var(--surface, #fff)",
        color: "var(--text, #222)",
      }}
    >
      <div style={{ fontSize: "14px", color: "inherit" }}>{title}</div>
      <div style={{ fontSize: "24px", fontWeight: 700, margin: "8px 0" }}>
        {value}
      </div>
    </div>
  );
}
