import React, { useState, useEffect } from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArtistCard = ({ artist }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = artist.profileImage && artist.profileImage.length > 1 && !imgError;

  return (
    <div className="artist-card-premium">
      <div className="artist-card-header">
        <div className="artist-profile-wrapper">
          {hasImage ? (
            <img
              src={artist.profileImage}
              alt={artist.name}
              className="artist-avatar"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="artist-avatar artist-avatar-fallback" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#C4622D', color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
              {artist.name?.[0] || '?'}
            </div>
          )}
          {artist.artistStatus === 'approved' && <CheckCircle className="verified-badge" size={18} />}
        </div>
        <div className="artist-info">
          <div className="artist-name-row">
            <h4>{artist.name}</h4>
          </div>
          {artist.bio && <p className="artist-category">{artist.bio}</p>}
          {artist.location?.city && (
            <p className="artist-location">
              <MapPin size={12} /> {artist.location.city}{artist.location.state ? `, ${artist.location.state}` : ''}
            </p>
          )}
        </div>
      </div>

      <Link to={`/artist/${artist._id}`} className="view-profile-btn">View Profile</Link>
    </div>
  );
};

const FeaturedArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await axios.get('/api/artists/featured');
        setArtists(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch featured artists:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) {
    return (
      <section className="featured-artists-section">
        <div className="section-header-centered">
          <span className="section-tag">Masters of Craft</span>
          <h2>Featured Artists</h2>
          <p>Meet the creators behind every masterpiece</p>
        </div>
        <div className="shimmer-grid">
          {[1, 2, 3].map(i => <div key={i} className="shimmer-card"></div>)}
        </div>
      </section>
    );
  }

  if (artists.length === 0) return null;

  return (
    <section className="featured-artists-section">
      <div className="section-header-centered">
        <span className="section-tag">Masters of Craft</span>
        <h2>Featured Artists</h2>
        <p>Meet the creators behind every masterpiece</p>
      </div>

      <div className="artists-grid">
        {artists.map(artist => (
          <ArtistCard key={artist._id} artist={artist} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedArtists;
