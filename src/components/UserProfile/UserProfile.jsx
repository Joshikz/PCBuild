export default function UserProfile({
  user,
  favoritesCount,
  cartCount,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Log out ${user.name}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "none",
        padding: 0,
        background: "transparent",
        color: "inherit",
        font: "inherit",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <img
        src={user.avatarUrl}
        alt={user.name}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />

      <span style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 700 }}>{user.name}</span>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          {user.role}
        </span>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          {user.email}
        </span>
      </span>

      <span style={{ marginLeft: "auto", fontSize: "14px" }}>
        ❤️ {favoritesCount}
      </span>
      <span style={{ fontSize: "14px" }}>Cart: {cartCount}</span>
    </button>
  );
}
