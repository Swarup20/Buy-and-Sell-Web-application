import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Profile</h2>
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>My Profile</h2>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Name:</strong> <span>{user.name}</span>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        {user.phone && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Phone:</strong> <span>{user.phone}</span>
          </div>
        )}
        <button onClick={handleLogout} style={{ marginTop: '2rem', width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
