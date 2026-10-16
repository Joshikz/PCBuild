import { Link, Outlet } from "react-router-dom";
import Container from "../components/Container/Container";

export default function ProfileLayout({ user }) {
  return (
    <Container>
      <nav
        aria-label="Profile navigation"
        style={{ display: "flex", gap: "16px", padding: "20px 0" }}
      >
        <Link to="/profile">Profile</Link>
        <Link to="/profile/settings">Settings</Link>
      </nav>
      <Outlet context={{ user }} />
    </Container>
  );
}
