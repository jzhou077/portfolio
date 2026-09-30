import { profile } from "../content";
import { useTheme } from "../hooks/useTheme";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="site-header">
      <h1 className="site-name">
        <a href="#top">{profile.name}</a>
      </h1>
      <nav className="site-nav" aria-label="Main">
        <a href="#experience">experience</a>
        <a href="#projects">projects</a>
        <a href="#contact">contact</a>
        <a href={profile.resume} target="_blank" rel="noopener">
          resume
        </a>
        <button type="button" className="theme-toggle" onClick={toggle}>
          {theme === "dark" ? "light" : "dark"}
        </button>
      </nav>
    </header>
  );
}
