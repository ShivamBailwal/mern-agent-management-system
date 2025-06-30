import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          Agent Management System
        </div>
        <ul className="navbar-nav">
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/agents" className={isActive('/agents')}>
              Agents
            </Link>
          </li>
          <li>
            <Link to="/upload" className={isActive('/upload')}>
              Upload & Distribute
            </Link>
          </li>
          <li>
            <span style={{ color: '#ccc' }}>Welcome, {user?.email}</span>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
