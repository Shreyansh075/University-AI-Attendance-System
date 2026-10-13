import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShieldCheck, LogOut, UserCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { state, logout } = useApp();
  const user = state?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const dashboardPath = user?.role ? `/${user.role}/dashboard` : null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            AI Attendance
          </Link>

          <nav id="primary-navigation" className={`site-nav${menuOpen ? ' site-nav-open' : ''}`}>
            <NavLink to="/" end className={({ isActive }) => `site-nav-link${isActive ? ' site-nav-link-active' : ''}`} onClick={closeMenu}>
              Home
            </NavLink>
            {!user ? (
              <>
                <NavLink to="/login" className={({ isActive }) => `site-nav-link${isActive ? ' site-nav-link-active' : ''}`} onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => `site-nav-link${isActive ? ' site-nav-link-active' : ''}`} onClick={closeMenu}>
                  Register
                </NavLink>
                <Link to="/login" className="btn btn-primary site-nav-cta" onClick={closeMenu}>
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <NavLink to={dashboardPath} className={({ isActive }) => `site-nav-link${isActive ? ' site-nav-link-active' : ''}`} onClick={closeMenu}>
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="btn btn-secondary site-nav-logout"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </nav>

          <div className="site-header-actions">
            {user && (
              <div className="site-user-label">
                <UserCircle2 className="h-5 w-5 text-primary-600" />
                <span>{user.name || 'User'}</span>
              </div>
            )}
            <button
              type="button"
              className="site-menu-toggle"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
      </div>
    </header>
  );
};

export default Navbar;
