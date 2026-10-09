export default function Container({ children, maxWidth = "1200px" }) {
  return (
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        padding: "0 16px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
