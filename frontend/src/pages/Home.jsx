import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const url = `http://localhost:5002/api/products?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]); // Re-fetch when category changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <section className="glass" style={{ padding: '2rem', marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Great Deals on Used Products
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.2rem' }}>
          Buy and sell electronics, furniture, vehicles, and more.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Loading...</p>
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>No products found. Be the first to post!</p>
        )}
      </div>
    </div>
  );
}

export default Home;
