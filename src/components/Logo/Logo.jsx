export default function Logo({
  src,
  altText,
  width = "140px",
  height = "auto",
}) {
  return (
    <img
      src={src}
      alt={altText}
      style={{
        width,
        height,
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}
