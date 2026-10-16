import { Link, NavLink } from "react-router-dom";

export default function Navigation({ navItems = [], onNavigate }) {
  return (
    <nav className="primary-navigation">
      {navItems.map((item) => {
        const isRouteLink = ["/catalog", "/about"].includes(item.link);
        const linkProps = {
          key: item.id,
          to: item.link,
          onClick: onNavigate,
          className: isRouteLink
            ? "navigation-link"
            : "primary-navigation-link",
        };

        return isRouteLink ? (
          <NavLink {...linkProps} end>
            {item.label}
          </NavLink>
        ) : (
          <Link {...linkProps}>{item.label}</Link>
        );
      })}
    </nav>
  );
}
