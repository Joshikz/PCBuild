import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main>
      <h1>404 - Page not found</h1>
      <p>The page you’re looking for doesn’t exist or may have moved.</p>
      <Link to="/">Return to Home</Link>
    </main>
  );
}
