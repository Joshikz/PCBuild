import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

export default function HeroSection({ heading, subheading, buttonText }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "var(--hero-bg, rgba(194, 65, 12, 0.08))",
        padding: "60px 20px",
        textAlign: "center",
        borderRadius: "8px",
        marginBottom: "40px",
      }}
    >
      <h1>{heading}</h1>
      <p style={{ color: "inherit" }}>{subheading}</p>
      <Button
        variant="primary"
        text={buttonText}
        onClick={() => navigate("/catalog")}
      />
    </div>
  );
}
