import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function UserProfile({
  user,
  favoritesCount,
  onClick,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="user-profile" ref={profileRef}>
      <button
        type="button"
        className="user-profile-trigger"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label={`Open profile menu for ${user.name}`}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
      >
        <img className="user-profile-avatar" src={user.avatarUrl} alt="" />
        <span className="user-profile-name">{user.name}</span>
      </button>

      <NavLink
        to="/favorites"
        className="profile-status-icon"
        title={`${favoritesCount} favorite products`}
        aria-label={`Open favorites: ${favoritesCount} items`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
        <span className="profile-status-count">{favoritesCount}</span>
      </NavLink>

      {isMenuOpen && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-user">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
            <span>{user.email}</span>
          </div>
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/profile/settings"
            role="menuitem"
            onClick={() => setIsMenuOpen(false)}
          >
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsMenuOpen(false);
              onClick();
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
