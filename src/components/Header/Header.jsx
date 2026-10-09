import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import UserProfile from "../UserProfile/UserProfile";
import useTheme from "../../context/useTheme";
import useAuth from "../../context/useAuth";
import useCart from "../../context/useCart";

const navItems = [
  { id: 1, label: "Catalog", link: "#catalog" },
  { id: 2, label: "Statistics", link: "#statistics" },
  { id: 3, label: "Reviews", link: "#reviews" },
];

export default function Header({
  logoSrc,
  onLogin,
  favoritesCount,
  isMobile,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { totalCount, totalPrice } = useCart();

  useEffect(() => {
    if (!isMobile || !isMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, isMenuOpen]);

  return (
    <header className="app-header" ref={headerRef}>
      <Logo src={logoSrc} altText="PC Build" width="160px" />
      {isMobile && (
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? "×" : "☰"}
        </button>
      )}
      {(!isMobile || isMenuOpen) && (
        <div className={isMobile ? "mobile-nav" : undefined}>
          <Navigation
            navItems={navItems}
            onNavigate={() => setIsMenuOpen(false)}
          />
        </div>
      )}
      <div className="header-actions">
        {isAuthenticated ? (
          <UserProfile
            cartCount={totalCount}
            cartTotal={totalPrice}
            favoritesCount={favoritesCount}
            user={user}
            onClick={logout}
          />
        ) : (
          <Button
            text="Log in"
            onClick={onLogin}
            isDisabled={isLoading}
          />
        )}
        <Button
          text={theme === "dark" ? "Light theme" : "Dark theme"}
          variant="secondary"
          onClick={toggleTheme}
        />
      </div>
    </header>
  );
}
