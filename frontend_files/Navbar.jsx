import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import './Navbar.css';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    addToast('Signed out successfully.', 'success');
    navigate('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">✒</span>
          <span className="navbar__logo-text">Inkwell</span>
        </Link>

        {/* Center nav */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
            Read
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/create" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
              Write
            </NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="navbar__actions">
          {isLoggedIn ? (
            <>
              <span className="navbar__user">
                <span className="navbar__user-dot" />
                {user?.email?.split('@')[0]}
              </span>
              <button className="navbar__btn navbar__btn--ghost" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__btn navbar__btn--ghost">Sign in</Link>
              <Link to="/signup" className="navbar__btn navbar__btn--filled">Start writing</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <NavLink to="/" end className="navbar__mobile-link">Read</NavLink>
        {isLoggedIn && (
          <NavLink to="/create" className="navbar__mobile-link">Write</NavLink>
        )}
        {isLoggedIn ? (
          <>
            <span className="navbar__mobile-user">{user?.email}</span>
            <button className="navbar__mobile-link" onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__mobile-link">Sign in</Link>
            <Link to="/signup" className="navbar__mobile-link navbar__mobile-link--accent">Start writing →</Link>
          </>
        )}
      </div>
    </header>
  );
}
