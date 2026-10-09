export default function Navigation({ navItems = [] }) {
  return (
    <nav style={{ display: "flex", gap: "16px" }}>
      {navItems.map((item) => (
        <a
          key={item.id}
          href={item.link}
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
