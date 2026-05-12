import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, SlidersHorizontal, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Painting', 'Sculpture', 'Textile', 'Pottery', 'Jewelry', 'Decor'];

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [addedId, setAddedId] = useState(null);
    const { addItem } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data.data.products || res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = products
        .filter(p => {
            const matchSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCat = activeCategory === 'All' || p.category === activeCategory;
            return matchSearch && matchCat;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'name') return a.title?.localeCompare(b.title);
            return 0;
        });

    return (
        <div className="products-page">
            {/* Page Header */}
            <div className="products-page-header">
                <div className="container">
                    <span className="section-tag">Our Collection</span>
                    <h1>Handcrafted Treasures</h1>
                    <p>Discover authentic Indian art and craft — each piece tells a story.</p>
                </div>
            </div>

            <div className="container products-layout">
                {/* Toolbar */}
                <div className="products-toolbar">
                    {/* Search */}
                    <div className="products-search-box">
                        <Search size={18} className="search-icon-inside" />
                        <input
                            type="text"
                            placeholder="Search products…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => setSearchTerm('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="products-sort">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="default">Sort: Default</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                            <option value="name">Name A–Z</option>
                        </select>
                    </div>

                    {/* Filter toggle (mobile) */}
                    <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                        <SlidersHorizontal size={18} />
                        Filters
                    </button>
                </div>

                {/* Category Pills */}
                <div className={`category-pills ${showFilters ? 'show' : ''}`}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                {!loading && (
                    <p className="results-count">
                        {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
                    </p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="shimmer-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="shimmer-card" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <span>🎨</span>
                        <h3>No products found</h3>
                        <p>Try a different search term or category.</p>
                        <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="product-grid">
                        {filtered.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="image-holder">
                                    <img
                                        src={product.images?.[0]?.url || ''}
                                        alt={product.title}
                                    />
                                    {product.discount > 0 && (
                                        <span className="badge">-{product.discount}%</span>
                                    )}
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
            </div>
        </div>
    );
};

export default Products;
