// Injected by Vite at build time (see vite.config.ts), so this never goes stale.
const updated = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(__BUILD_DATE__));

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Last updated {updated}.
      </p>
    </footer>
  );
}
