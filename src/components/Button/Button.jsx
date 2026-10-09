export default function Button({
  text,
  variant = "primary",
  isDisabled = false,
  onClick,
}) {
  const stylesByVariant = {
    primary: {
      background: "var(--accent)",
      color: "var(--accent-contrast, #fff)",
    },
    secondary: {
      background: "var(--bg-surface)",
      color: "var(--text-primary)",
    },
    outline: {
      background: "transparent",
      color: "var(--accent)",
      border: "1px solid var(--accent)",
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      style={{
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        fontSize: "14px",
        fontWeight: 600,
        border: "none",
        transition: "all 0.2s",
        opacity: isDisabled ? 0.6 : 1,
        ...stylesByVariant[variant],
      }}
    >
      {text}
    </button>
  );
}
