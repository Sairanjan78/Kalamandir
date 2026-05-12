import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await axios.post('/api/messages', formData);
      setStatus({ type: 'success', msg: res.data.message });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.message || 'Failed to send message. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-us-section" id="contact">
      <div className="container">
        <div className="contact-premium-wrapper">
          <div className="contact-header-v3">
            <span className="section-tag">Direct Support</span>
            <h2>How Can We Help?</h2>
            <p>Our artisans and support team usually respond within 24 hours.</p>
          </div>

          <div className="contact-grid-v3">
            <div className="contact-info-v3">
              <div className="info-card-v3">
                <div className="info-icon-v3"><Mail size={24} /></div>
                <div className="info-content-v3">
                  <h4>Email Us</h4>
                  <p>hello@kalamandir.art</p>
                </div>
              </div>
              <div className="info-card-v3">
                <div className="info-icon-v3"><Phone size={24} /></div>
                <div className="info-content-v3">
                  <h4>Call Us</h4>
                  <p>+91 73810 57877</p>
                </div>
              </div>
              <div className="info-card-v3">
                <div className="info-icon-v3"><MapPin size={24} /></div>
                <div className="info-content-v3">
                  <h4>Visit Us</h4>
                  <p>Odisha, India</p>
                </div>
              </div>
            </div>

            <div className="contact-form-v3">
              <form onSubmit={handleSubmit} className="v3-form">
                {status.msg && (
                  <div className={`status-alert-v3 ${status.type}`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : null}
                    <span>{status.msg}</span>
                  </div>
                )}
                
                <div className="input-group-v3">
                  <input 
                    type="text" 
                    placeholder=" " 
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <label htmlFor="name">Full Name</label>
                </div>

                <div className="input-group-v3">
                  <input 
                    type="email" 
                    placeholder=" " 
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <label htmlFor="email">Email Address</label>
                </div>

                <div className="input-group-v3">
                  <textarea 
                    placeholder=" " 
                    id="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                  <label htmlFor="message">Your Message</label>
                </div>

                <button type="submit" className="submit-btn-v3" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="spin-v3" /> Processing...</>
                  ) : (
                    <>Send Inquiry <Send size={20} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
