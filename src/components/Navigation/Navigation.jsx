export default function Navigation({ navItems = [], onNavigate }) {
  return (
    <nav style={{ display: "flex", gap: "16px" }}>
      {navItems.map((item) => (
        <a
          key={item.id}
          href={item.link}
          onClick={onNavigate}
          style={{
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
