import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  return (
    <section className="contact-us-section" id="contact">
      <div className="contact-card-container">
        <div className="contact-info-panel">
          <div className="section-header-left">
            <span className="section-tag-light">Get in Touch</span>
            <h2>Let's Talk Heritage</h2>
            <p>Have questions about a specific art form or custom orders? Reach out to us.</p>
          </div>

          <div className="contact-links">
            <div className="contact-link-item">
              <div className="icon-box"><Mail size={20} /></div>
              <div className="link-text">
                <label>Email Us</label>
                <p>hello@kalamandir.art</p>
              </div>
            </div>
            <div className="contact-link-item">
              <div className="icon-box"><Phone size={20} /></div>
              <div className="link-text">
                <label>Call Us</label>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-link-item">
              <div className="icon-box"><MapPin size={20} /></div>
              <div className="link-text">
                <label>Visit Studio</label>
                <p>Art Lane, Hitech City, Hyderabad, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-panel">
          <form className="premium-form">
            <div className="form-row">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your name" />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="email@example.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Message</label>
                <textarea rows="4" placeholder="Tell us what's on your mind..."></textarea>
              </div>
            </div>
            <button type="submit" className="submit-btn-premium">
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
