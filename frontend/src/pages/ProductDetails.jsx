import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', color: '#ef4444', padding: '3rem' }}>{error}</div>;
  if (!product) return null;

  const imageUrl = product.image_url 
    ? `http://localhost:5002${product.image_url}` 
    : 'https://via.placeholder.com/600x400?text=No+Image';

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(product.price));

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>&larr; Back to listings</Link>
      
      <div className="glass" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Responsive layout via inline styles: we'll use a wrap approach */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
          <div style={{ flex: '1 1 400px' }}>
            <img 
              src={imageUrl} 
              alt={product.title} 
              style={{ width: '100%', height: 'auto', borderRadius: '16px', objectFit: 'cover', maxHeight: '500px' }} 
            />
          </div>
          
          <div style={{ flex: '1 1 400px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{product.title}</h1>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>{formattedPrice}</div>
            
            <div style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Description</h3>
              <p style={{ color: 'var(--text-color)', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                {product.description}
              </p>
            </div>
            
            <div style={{ marginTop: 'auto', padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Seller Info</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Listed beautifully by <strong style={{ color: 'var(--text-color)' }}>{product.seller_name}</strong> on {new Date(product.created_at).toLocaleDateString()}</p>
              
              {showContact ? (
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid var(--primary)' }}>
                  <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> <a href={`mailto:${product.seller_email}`}>{product.seller_email}</a></p>
                  {product.seller_phone && <p><strong>Phone:</strong> {product.seller_phone}</p>}
                </div>
              ) : (
                <button onClick={() => setShowContact(true)} style={{ width: '100%' }}>
                  Contact Seller
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
