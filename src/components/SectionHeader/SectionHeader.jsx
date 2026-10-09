export default function SectionHeader({ title, subtitle, align = "left" }) {
  return (
    <div style={{ margin: "32px 0 20px", textAlign: align }}>
      <h2 style={{ margin: "0 0 8px" }}>{title}</h2>
      {subtitle && (
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>{subtitle}</p>
      )}
    </div>
  );
}
