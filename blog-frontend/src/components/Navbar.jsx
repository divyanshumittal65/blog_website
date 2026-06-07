import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    addToast("Signed out successfully.", "success");
    navigate("/");
  };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">BW</span>
          <span className="navbar__logo-text">Blog Website</span>
        </Link>

        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Read
          </NavLink>
          {isLoggedIn && (
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive ? "navbar__link navbar__link--active" : "navbar__link"
              }
            >
              Write
            </NavLink>
          )}
        </nav>

        <div className="navbar__actions">
          {isLoggedIn ? (
            <>
              <span className="navbar__user">
                <span className="navbar__user-dot" />
                {user?.email ?? `User ${user?.id ?? ""}`}
              </span>
              <button className="navbar__btn navbar__btn--ghost" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__btn navbar__btn--ghost">
                Sign in
              </Link>
              <Link to="/signup" className="navbar__btn navbar__btn--filled">
                Start writing
              </Link>
            </>
          )}
        </div>

        <button
          className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}>
        <NavLink to="/" end className="navbar__mobile-link">
          Read
        </NavLink>
        {isLoggedIn && (
          <NavLink to="/create" className="navbar__mobile-link">
            Write
          </NavLink>
        )}
        {isLoggedIn ? (
          <>
            <span className="navbar__mobile-user">{user?.email ?? `User ${user?.id ?? ""}`}</span>
            <button className="navbar__mobile-link" onClick={handleLogout} type="button">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__mobile-link">
              Sign in
            </Link>
            <Link to="/signup" className="navbar__mobile-link navbar__mobile-link--accent">
              Start writing
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
