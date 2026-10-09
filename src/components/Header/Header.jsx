import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import UserProfile from "../UserProfile/UserProfile";

const navItems = [
  { id: 1, label: "Catalog", link: "#catalog" },
  { id: 2, label: "Builds", link: "#builds" },
  { id: 3, label: "Support", link: "#support" },
];

const user = {
  name: "Ilim Shomorov",
  role: "Gaming Setup Planner",
  email: "ilim@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function Header({
  logoSrc,
  isDarkMode,
  onToggleTheme,
  isAuthenticated,
  onLogin,
  onLogout,
  favoritesCount,
  cartCount,
}) {
  return (
    <header className="app-header">
      <Logo src={logoSrc} altText="PC Build" width="160px" />
      <Navigation navItems={navItems} />
      <div className="header-actions">
        {isAuthenticated ? (
          <UserProfile
            cartCount={cartCount}
            favoritesCount={favoritesCount}
            user={user}
            onClick={onLogout}
          />
        ) : (
          <Button text="Log in" onClick={onLogin} />
        )}
        <Button
          text={isDarkMode ? "Light theme" : "Dark theme"}
          variant="secondary"
          onClick={onToggleTheme}
        />
      </div>
    </header>
  );
}
