import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PostAd() {
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: '' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      setError('You must be logged in to post an ad.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (image) data.append('image', image);

    try {
      const res = await fetch('http://localhost:5002/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      let result;
      try {
        result = await res.json();
      } catch (parseErr) {
        console.error('Failed to parse POST /api/products response', parseErr);
        result = { error: `Server returned ${res.status} ${res.statusText}` };
      }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        setError(result.error || `Server returned ${res.status}`);
      } else {
        navigate(`/product/${result.id}`);
      }
    } catch (err) {
      console.error('Post ad request failed', err);
      setError(`An error occurred while posting the ad: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
      <form onSubmit={handleSubmit} className="glass" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Post a New Ad</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required></textarea>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ padding: '0.5rem' }} />
        </div>
        
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
          {loading ? 'Posting...' : 'Post Ad'}
        </button>
      </form>
    </div>
  );
}

export default PostAd;
