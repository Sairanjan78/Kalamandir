import React from 'react';
import { Star, CheckCircle, MapPin, Quote } from 'lucide-react';

const artistData = [
  {
    id: 1,
    name: "Sita Devi",
    category: "Madhubani Art",
    location: "Mubarakpur, Bihar",
    rating: 4.9,
    reviews: 124,
    verified: true,
    profileImage: "/api/my-pics/artist_profile_madhubani_1776627541121.png",
    coverImages: [
      "/api/my-pics/madhubani_art_category_1776626790880.png",
      "/api/my-pics/madhubani_art_category_1776626790880.png"
    ],
    quote: "Every dot in my art is a prayer for my village."
  },
  {
    id: 2,
    name: "Jivya Soma Mashe",
    category: "Warli Art",
    location: "Dahanu, Maharashtra",
    rating: 4.8,
    reviews: 89,
    verified: true,
    profileImage: "/api/my-pics/warli_art_category_1776626957376.png",
    coverImages: [
      "/api/my-pics/warli_art_category_1776626957376.png",
      "/api/my-pics/warli_art_category_1776626957376.png"
    ],
    quote: "Life is a circle, and my art represents our dance within it."
  },
  {
    id: 3,
    name: "Haripada Pal",
    category: "Terracotta Pottery",
    location: "Bankura, West Bengal",
    rating: 4.7,
    reviews: 56,
    verified: false,
    profileImage: "/api/my-pics/indian_pottery_category_1776627122349.png",
    coverImages: [
      "/api/my-pics/indian_pottery_category_1776627122349.png",
      "/api/my-pics/indian_pottery_category_1776627122349.png"
    ],
    quote: "Clay has a memory. I just help it remember the old shapes."
  }
];

const ArtistCard = ({ artist }) => {
  return (
    <div className="artist-card-premium">
      <div className="artist-card-header">
        <div className="artist-profile-wrapper">
          <img src={artist.profileImage} alt={artist.name} className="artist-avatar" />
          {artist.verified && <CheckCircle className="verified-badge" size={18} />}
        </div>
        <div className="artist-info">
          <div className="artist-name-row">
            <h4>{artist.name}</h4>
            <div className="artist-rating">
              <Star size={14} fill="currentColor" />
              <span>{artist.rating}</span>
            </div>
          </div>
          <p className="artist-category">{artist.category}</p>
          <p className="artist-location">
            <MapPin size={12} /> {artist.location}
          </p>
        </div>
      </div>

      <div className="artist-quote">
        <Quote size={12} className="quote-icon" />
        <p>{artist.quote}</p>
      </div>

      <div className="artist-previews">
        {artist.coverImages.map((img, idx) => (
          <div key={idx} className="preview-img-holder">
            <img src={img} alt={`Work by ${artist.name}`} />
          </div>
        ))}
      </div>

      <button className="view-profile-btn">View Profile</button>
    </div>
  );
};

const FeaturedArtists = () => {
  return (
    <section className="featured-artists-section">
      <div className="section-header-centered">
        <span className="section-tag">Masters of Craft</span>
        <h2>Featured Artists</h2>
        <p>Meet the creators behind every masterpiece</p>
      </div>

      <div className="artists-grid">
        {artistData.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedArtists;
