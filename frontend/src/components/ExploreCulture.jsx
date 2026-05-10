import React from 'react';
import { Link } from 'react-router-dom';

const cultureData = [
  {
    id: 'Madhubani',
    title: 'Madhubani Art',
    location: 'Bihar',
    desc: 'Known for intricate patterns and mythological stories',
    image: '/api/my-pics/madhubani_art_category_1776626790880.png'
  },
  {
    id: 'Warli',
    title: 'Warli Art',
    location: 'Maharashtra',
    desc: 'Minimal tribal art representing daily life',
    image: '/api/my-pics/warli_art_category_1776626957376.png'
  },
  {
    id: 'Pottery',
    title: 'Pottery',
    location: 'Rajasthan / Gujarat',
    desc: 'Handcrafted clay work shaped by tradition',
    image: '/api/my-pics/indian_pottery_category_1776627122349.png'
  }
];

const ExploreCulture = () => {
  return (
    <section className="explore-culture-section">
      <div className="section-header">
        <h2>Explore Indian Art Traditions</h2>
        <p>Each piece carries centuries of culture and craftsmanship</p>
      </div>

      <div className="culture-grid">
        {cultureData.map((item) => (
          <div key={item.id} className="culture-card">
            <div className="culture-image-holder">
              <img src={item.image} alt={item.title} />
              <div className="culture-overlay">
                <span className="location-tag">📍 {item.location}</span>
              </div>
            </div>
            <div className="culture-content">
              <h3>🎨 {item.title}</h3>
              <p>🧠 {item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="storytelling-block">
        <p>“From the walls of ancient villages to modern homes, Indian art tells stories of life, devotion, and heritage.”</p>
      </div>

      <div className="view-all-wrapper">
        <Link to="/products" className="view-all-btn">View All Products</Link>
      </div>
    </section>
  );
};

export default ExploreCulture;
