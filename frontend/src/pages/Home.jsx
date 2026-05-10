import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import ExploreCulture from '../components/ExploreCulture';
import FeaturedArtists from '../components/FeaturedArtists';
import ArtProcess from '../components/ArtProcess';

import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentHero, setCurrentHero] = useState(0);

    // Helper to translate your Windows path to a Web URL
    const pathToUrl = (path) => {
        const filename = path.split('\\').pop();
        return `/api/my-pics/${encodeURIComponent(filename)}`;
    };

    const heroImages = [
        "D:\\craft\\pic\\poster_image.jpeg",
        "D:\\craft\\pic\\WhatsApp Image 2026-04-19 at 2.40.36 PM.jpeg",
        "D:\\craft\\pic\\WhatsApp Image 2026-04-19 at 2.27.32 PM.jpeg"
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

    const filteredProducts = products.filter(p => {
        return p.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

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
                                    <button className="add-btn">
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
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
