import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, CheckCircle, ShoppingCart, ArrowLeft, Palette, Package, Calendar, Star } from 'lucide-react';

const ArtistProfile = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalProducts: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const res = await axios.get(`/api/artists/${id}`);
                const data = res.data.data;

                // The API returns { artist: ArtistProfile (populated with userId), products, stats }
                const profile = data.artist;
                const user = profile?.userId || {};

                setArtist({
                    _id: user._id,
                    name: user.name || 'Unknown Artist',
                    email: user.email,
                    profileImage: user.profileImage,
                    bio: user.bio,
                    location: user.location,
                    phone: user.phone,
                    joinedAt: user.createdAt,
                    categories: profile.categories || [],
                    experience: profile.experience,
                    artStyle: profile.artStyle,
                    materialsUsed: profile.materialsUsed || [],
                    acceptsCommissions: profile.acceptsCommissions,
                    commissionDetails: profile.commissionDetails,
                    rating: profile.rating,
                    totalReviews: profile.totalReviews,
                    socialLinks: profile.socialLinks || {},
                    workshopAddress: profile.workshopAddress
                });

                setProducts(data.products || []);
                setStats(data.stats || { totalProducts: 0 });
            } catch (err) {
                console.error('Failed to load artist:', err);
                setError(err.response?.status === 404 ? 'Artist not found' : 'Failed to load artist profile');
            } finally {
                setLoading(false);
            }
        };

        fetchArtist();
    }, [id]);

    if (loading) {
        return (
            <div className="artist-profile-page">
                <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
                    <div className="shimmer-grid">
                        {[1, 2, 3].map(i => <div key={i} className="shimmer-card"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div className="artist-profile-page">
                <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#3B2A1A', marginBottom: '0.5rem' }}>
                        {error || 'Artist not found'}
                    </h2>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>The artist profile you're looking for doesn't exist.</p>
                    <Link to="/" className="hero-btn" style={{ display: 'inline-block' }}>Back to Home</Link>
                </div>
            </div>
        );
    }

    const hasProfileImage = artist.profileImage && artist.profileImage.length > 1 && !imgError;
    const locationStr = [artist.location?.city, artist.location?.state].filter(Boolean).join(', ');
    const joinedDate = artist.joinedAt ? new Date(artist.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : null;

    return (
        <div className="artist-profile-page">
            {/* Hero Banner */}
            <div className="ap-hero-banner">
                <div className="ap-hero-overlay"></div>
                <div className="container ap-hero-content">
                    <Link to="/" className="ap-back-link"><ArrowLeft size={18} /> Back</Link>

                    <div className="ap-hero-card">
                        <div className="ap-hero-avatar-wrap">
                            {hasProfileImage ? (
                                <img
                                    src={artist.profileImage}
                                    alt={artist.name}
                                    className="ap-hero-avatar"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="ap-hero-avatar ap-hero-avatar-fallback">
                                    {artist.name[0]}
                                </div>
                            )}
                            <CheckCircle className="ap-verified-icon" size={24} />
                        </div>

                        <div className="ap-hero-info">
                            <h1>{artist.name}</h1>
                            {artist.bio && <p className="ap-hero-bio">{artist.bio}</p>}

                            <div className="ap-hero-meta">
                                {locationStr && (
                                    <span className="ap-meta-item"><MapPin size={14} /> {locationStr}</span>
                                )}
                                {joinedDate && (
                                    <span className="ap-meta-item"><Calendar size={14} /> Joined {joinedDate}</span>
                                )}
                                {artist.experience > 0 && (
                                    <span className="ap-meta-item"><Star size={14} /> {artist.experience}+ years experience</span>
                                )}
                            </div>

                            {artist.categories.length > 0 && (
                                <div className="ap-tag-list">
                                    {artist.categories.map(cat => (
                                        <span key={cat} className="ap-skill-tag"><Palette size={12} /> {cat}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="ap-hero-stats">
                            <div className="ap-stat-box">
                                <span className="ap-stat-num">{stats.totalProducts}</span>
                                <span className="ap-stat-label">Artworks</span>
                            </div>
                            {artist.rating > 0 && (
                                <div className="ap-stat-box">
                                    <span className="ap-stat-num">{artist.rating.toFixed(1)}</span>
                                    <span className="ap-stat-label">Rating</span>
                                </div>
                            )}
                            {artist.acceptsCommissions && (
                                <div className="ap-stat-box ap-stat-commissions">
                                    <span className="ap-stat-num">✓</span>
                                    <span className="ap-stat-label">Commissions</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details + Products */}
            <div className="container ap-body-section">
                {/* Additional Info Cards */}
                {(artist.artStyle || artist.materialsUsed.length > 0 || artist.commissionDetails) && (
                    <div className="ap-info-cards">
                        {artist.artStyle && (
                            <div className="ap-info-card">
                                <h3>Art Style</h3>
                                <p>{artist.artStyle}</p>
                            </div>
                        )}
                        {artist.materialsUsed.length > 0 && (
                            <div className="ap-info-card">
                                <h3>Materials Used</h3>
                                <div className="ap-tag-list">
                                    {artist.materialsUsed.map(m => (
                                        <span key={m} className="ap-material-tag">{m}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {artist.acceptsCommissions && artist.commissionDetails && (
                            <div className="ap-info-card">
                                <h3>Commission Info</h3>
                                <p>{artist.commissionDetails}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Products Section */}
                <div className="ap-products-section">
                    <div className="section-header-centered">
                        <span className="section-tag">Collection</span>
                        <h2>Artworks by {artist.name}</h2>
                        <p>{products.length} {products.length === 1 ? 'artwork' : 'artworks'} available</p>
                    </div>

                    {products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
                            <Package size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                            <h3 style={{ color: '#3B2A1A', marginBottom: '0.5rem' }}>No artworks listed yet</h3>
                            <p>This artist hasn't added any products to their collection.</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.map(product => (
                                <div key={product._id} className="product-card">
                                    <div className="image-holder">
                                        <img src={product.images?.[0]?.url || ''} alt={product.title} />
                                        {product.discount > 0 && <span className="badge">-{product.discount}%</span>}
                                    </div>
                                    <div className="card-content">
                                        <p className="category-tag">{product.category}</p>
                                        <h3>{product.title}</h3>
                                        <div className="price-row">
                                            <span className="current-price">₹{product.price}</span>
                                            {product.originalPrice && (
                                                <span className="old-price">₹{product.originalPrice}</span>
                                            )}
                                        </div>
                                        <button className="add-btn">
                                            <ShoppingCart size={18} /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtistProfile;
