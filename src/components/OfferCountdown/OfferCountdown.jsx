import { useEffect, useState } from "react";

const INITIAL_SECONDS = 10 * 60;

export default function OfferCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <p
      role="timer"
      aria-label={`Special offer ends in ${minutes} minutes and ${seconds} seconds`}
      style={{
        margin: "0 0 20px",
        padding: "12px",
        borderRadius: "6px",
        background: "var(--accent)",
        color: "var(--accent-contrast, #fff)",
        textAlign: "center",
        fontWeight: 700,
      }}
    >
      Special offer ends in {minutes}:{seconds}
    </p>
  );
}
