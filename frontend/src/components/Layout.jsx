import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

function initialTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// NavLink tells us if its address is the current one, so the active link is marked by itself
function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

// Header and bottom bar, written once for every page.
// <Outlet /> is the spot where the current page is drawn.
export default function Layout() {
  const [theme, setTheme] = useState(initialTheme);

  function handleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }

  return (
    <>
      <header className={styles.header}>
        <span className={styles.logo} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="2.2" />
            <path d="M3.2 10.5l6.6.7M20.8 10.5l-6.6.7M12 14.2V21" />
          </svg>
        </span>
        <h1 className={styles.title}>CarLog</h1>
        <p className={styles.description}>
          Keep track of ITP, RCA, road tax and service for your cars.
        </p>
        <button
          className={styles.themeToggle}
          type="button"
          onClick={handleTheme}
          aria-pressed={theme === "dark"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {/* The icon shows the mode you switch to: sun in dark mode, moon in light mode */}
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Bottom bar, like a mobile app. "end" on the first link: active only on "/" exactly */}
      <footer className={styles.footer}>
        <nav className={styles.nav} aria-label="Main" data-testid="nav">
          <NavLink to="/" end className={navClass}>
            Deadlines
          </NavLink>
          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
        </nav>
        <p className={styles.note}>CarLog, Web Technologies project</p>
      </footer>
    </>
  );
}
