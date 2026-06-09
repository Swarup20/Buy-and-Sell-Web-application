import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const imageUrl = product.image_url 
    ? `http://localhost:5002${product.image_url}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(product.price));

  return (
    <Link to={`/product/${product.id}`} className="glass animate-fade-in" style={{ display: 'flex', flexDirection: 'column', color: 'inherit' }}>
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img 
          src={imageUrl} 
          alt={product.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{product.title}</h3>
          <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.1rem' }}>{formattedPrice}</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
          {product.category}
        </p>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Posted by {product.seller_name}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
