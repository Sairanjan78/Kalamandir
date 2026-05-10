import React from 'react';
import { Users, Palette, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <section className="about-us-section" id="about">
      <div className="section-header-centered">
        <span className="section-tag">Our Story</span>
        <h2>Our Heritage, Your Home</h2>
        <p>Preserving the soul of Indian craftsmanship since 2026</p>
      </div>

      <div className="about-grid">
        <div className="about-image-story">
          <img src="/api/my-pics/indian_pottery_category_1776627122349.png" alt="Artisan at work" />
          <div className="experience-badge">
            <span className="years">15+</span>
            <span className="text">Years of <br/>Legacy</span>
          </div>
        </div>

        <div className="about-content">
          <h3>Bringing Ancient Wisdom to Modern Life</h3>
          <p>
            Kalamandir was born out of a simple realization: the stories of our ancestors, 
            told through their hands, were fading away. We set out on a journey across 
            the forgotten villages of Bharat to find the guardians of these traditions.
          </p>
          <p>
            Today, we empower over 500+ rural artisans by providing them a global stage. 
            Every purchase you make isn't just a transaction; it's a heartbeat for a dying 
            tradition and a step towards a sustainable legacy.
          </p>

          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-info">
                <h4>500+</h4>
                <p>Artisans</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><Palette size={24} /></div>
              <div className="stat-info">
                <h4>20+</h4>
                <p>Art Forms</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><Heart size={24} /></div>
              <div className="stat-info">
                <h4>10k+</h4>
                <p>Deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
