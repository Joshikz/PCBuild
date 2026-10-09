export default function Badge({ label, colorScheme = "green" }) {
  const colorMap = {
    green: "#28a745",
    red: "#dc3545",
    yellow: "#ffc107",
  };

  const textColor = colorScheme === "yellow" ? "#212529" : "#fff";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        color: textColor,
        backgroundColor: colorMap[colorScheme] || colorMap.green,
      }}
    >
      {label}
    </span>
  );
}
