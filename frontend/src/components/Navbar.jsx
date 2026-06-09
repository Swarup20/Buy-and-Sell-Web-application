import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        Classifieds
      </Link>
      <nav className="nav-links glass" style={{ padding: '0.5rem 1.5rem', borderRadius: '30px' }}>
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/post-ad" className="btn" style={{ padding: '0.4rem 1rem' }}>Post Ad</Link>
            <Link to="/profile" style={{ color: 'var(--text-muted)', marginLeft: '1rem' }}>Profile</Link>
            <span style={{ color: 'var(--text-muted)', marginLeft: '1rem' }}>Hi, {user?.name}</span>
            <button onClick={handleLogout} style={{ background: 'transparent', padding: 0, color: 'var(--primary)', boxShadow: 'none', marginLeft: '1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn" style={{ padding: '0.4rem 1rem' }}>Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
