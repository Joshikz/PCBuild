import RatingStars from "../RatingStars/RatingStars";

export default function TestimonialCard({
  authorName,
  authorRole,
  avatar,
  text,
  date,
  rating,
}) {
  return (
    <article
      style={{
        padding: "20px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        background: "var(--surface)",
        color: "var(--text)",
      }}
    >
      <RatingStars score={rating} reviewsCount={0} />
      <blockquote style={{ margin: "16px 0" }}>{text}</blockquote>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={avatar}
          alt={authorName}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <div style={{ fontWeight: 700 }}>{authorName}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {authorRole}
          </div>
          <time
            dateTime={date}
            style={{ color: "var(--text-secondary)", fontSize: "12px" }}
          >
            {date}
          </time>
        </div>
      </div>
    </article>
  );
}
