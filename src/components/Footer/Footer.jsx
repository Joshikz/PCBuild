import Logo from "../Logo/Logo";

export default function Footer({ copyrightText, socialLinks = [], logoSrc }) {
  return (
    <footer
      style={{
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        padding: "40px 0",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Logo src={logoSrc} altText="PC Configurator" width="140px" />
        <div>{copyrightText}</div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <span aria-hidden="true">{link.icon}</span> {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
