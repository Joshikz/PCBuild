import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

export default function MainLayout({
  logoSrc,
  onLogin,
  favoritesCount,
  isMobile,
  copyrightText,
  socialLinks,
}) {
  return (
    <div className="main-layout">
      <Header
        key={isMobile ? "mobile" : "desktop"}
        logoSrc={logoSrc}
        onLogin={onLogin}
        favoritesCount={favoritesCount}
        isMobile={isMobile}
      />
      <div className="main-layout-content">
        <Outlet />
      </div>
      <Footer
        copyrightText={copyrightText}
        socialLinks={socialLinks}
        logoSrc={logoSrc}
      />
    </div>
  );
}
