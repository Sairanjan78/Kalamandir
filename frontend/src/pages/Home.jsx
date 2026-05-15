import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ExploreCulture from '../components/ExploreCulture';
import FeaturedArtists from '../components/FeaturedArtists';
import ArtProcess from '../components/ArtProcess';

import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedId, setAddedId] = useState(null);
    const { addItem } = useCart();
    const { user } = useAuth();
    const [currentHero, setCurrentHero] = useState(0);

    // Helper to translate filename to Public URL
    const pathToUrl = (path) => {
        const filename = path.split('\\').pop().split('/').pop();
        return `/pic/${filename}`;
    };

    const heroImages = [
        "hero1.jpg",
        "hero2.jpg",
        "hero3.jpg"
    ].map(pathToUrl);

    useEffect(() => {
        fetchProducts();

        const heroTimer = setInterval(() => {
            setCurrentHero((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(heroTimer);
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data.data.products || res.data.data);
        } catch (err) {
            console.error('Fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products;

    return (
        <div className="home-container">
            <div className="hero-wrapper">
                <div className="premium-hero">
                    {heroImages.map((img, idx) => (
                        <img
                            key={idx}
                            className={`hero-bg-image ${currentHero === idx ? 'active' : ''}`}
                            src={img}
                            alt={`Slide ${idx}`}
                        />
                    ))}
                    <div className="hero-overlay"></div>

                    <div className="hero-content-v2">
                        <h1>Art Of <br />Thoughts</h1>
                        <p>Handmade To Love.</p>
                        <Link to="/products" className="hero-btn">View Products</Link>
                    </div>

                    <div className="carousel-dots">
                        {heroImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`dot ${currentHero === idx ? 'active' : ''}`}
                                onClick={() => setCurrentHero(idx)}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="main-content container">
                <ExploreCulture />

                <FeaturedArtists />

                <ArtProcess />



                <div className="section-header-centered">
                    <span className="section-tag">Collectibles</span>
                    <h2>Available Collections</h2>
                    <p>Discover unique handmade art from across India</p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="shimmer-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="shimmer-card"></div>)}
                        </div>
                    </div>
                ) : (
                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="image-holder">
                                    <img src={product.images?.[0]?.url} alt={product.title} />
                                    {product.discount > 0 && <span className="badge">-{product.discount}%</span>}
                                </div>
                                <div className="card-content">
                                    <h3>{product.title}</h3>
                                    <p className="category-tag">{product.category}</p>
                                    <div className="price-row">
                                        <span className="current-price">₹{product.price}</span>
                                        {product.originalPrice && <span className="old-price">₹{product.originalPrice}</span>}
                                    </div>
                                    {(!user || user.role === 'customer') && (
                                        <button className={`add-btn ${addedId === product._id ? 'added' : ''}`} onClick={() => {
                                            addItem(product);
                                            setAddedId(product._id);
                                            setTimeout(() => setAddedId(null), 1500);
                                        }}>
                                            {addedId === product._id ? <><Check size={18} /> Added</> : <><ShoppingCart size={18} /> Add to Cart</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <div className="container-wide">
                <AboutUs />
                <ContactUs />
            </div>
        </div>
    );
};

export default Home;
