import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import UserProfile from "../UserProfile/UserProfile";
import useTheme from "../../context/useTheme";
import useAuth from "../../context/useAuth";
import useCart from "../../context/useCart";

const navItems = [
  { id: 1, label: "Catalog", link: "/catalog" },
  { id: 2, label: "About", link: "/about" },
  { id: 3, label: "Statistics", link: "/#statistics" },
  { id: 4, label: "Reviews", link: "/#reviews" },
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
      <Link className="header-logo" to="/">
        <Logo src={logoSrc} altText="PC Build" width="180px" />
      </Link>
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
        <div className={isMobile ? "mobile-nav" : "header-navigation"}>
          <Navigation
            navItems={navItems}
            onNavigate={() => setIsMenuOpen(false)}
          />
        </div>
      )}
      <div className="header-actions">
        {isAuthenticated ? (
          <UserProfile
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
        <NavLink
          to="/cart"
          onClick={() => setIsMenuOpen(false)}
          className={({ isActive }) =>
            isActive ? "header-cart-link active" : "header-cart-link"
          }
          aria-label={`Open cart: ${totalCount} items, ${totalPrice.toLocaleString()} tenge`}
          title={`Cart: ${totalCount} items · ${totalPrice.toLocaleString()} ₸`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3h2l2.2 12.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span className="profile-status-count">{totalCount}</span>
        </NavLink>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
