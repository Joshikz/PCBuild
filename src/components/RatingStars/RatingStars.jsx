export default function RatingStars({ score, reviewsCount }) {
  const roundedScore = Math.round(score);
  const stars = Array.from({ length: 5 }, (_, index) =>
    index < roundedScore ? "★" : "☆",
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span aria-label={`Rating: ${score} out of 5`}>
        {stars.map((star, index) => (
          <span
            key={`${star}-${index}`}
            style={{
              color: index < roundedScore ? "#ffc107" : "var(--border-color)",
              fontSize: "14px",
            }}
          >
            {star}
          </span>
        ))}
      </span>
      <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
        ({reviewsCount})
      </span>
    </div>
  );
}
