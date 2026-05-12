import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ExploreCulture = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/products/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="explore-culture-section">
      <div className="section-header">
        <h2>Explore Indian Art Traditions</h2>
        <p>Each piece carries centuries of culture and craftsmanship</p>
      </div>

      {loading ? (
        <div className="shimmer-grid">
          {[1, 2, 3].map(i => <div key={i} className="shimmer-card"></div>)}
        </div>
      ) : categories.length > 0 ? (
        <div className="culture-grid">
          {categories.slice(0, 6).map((item) => (
            <div key={item._id} className="culture-card">
              <div className="culture-content">
                <h3>🎨 {item._id}</h3>
                <p>{item.count} {item.count === 1 ? 'artwork' : 'artworks'} available</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="culture-grid">
          <div className="culture-card">
            <div className="culture-content">
              <h3>🎨 Coming Soon</h3>
              <p>Artists are getting onboarded — check back soon!</p>
            </div>
          </div>
        </div>
      )}

      <div className="storytelling-block">
        <p>"From the walls of ancient villages to modern homes, Indian art tells stories of life, devotion, and heritage."</p>
      </div>

      <div className="view-all-wrapper">
        <Link to="/products" className="view-all-btn">View All Products</Link>
      </div>
    </section>
  );
};

export default ExploreCulture;
