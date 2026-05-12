import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { items, removeItem, updateQuantity, itemCount, subtotal, clearCart } = useCart();

    const shipping = subtotal > 0 ? 100 : 0;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-hero">
                    <div className="container">
                        <span className="section-tag" style={{ color: '#D4A017' }}>Shopping</span>
                        <h1>Your Cart</h1>
                    </div>
                </div>
                <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
                    <div className="cart-empty">
                        <ShoppingBag size={64} strokeWidth={1} />
                        <h2>Your cart is empty</h2>
                        <p>Explore our collection of handcrafted Indian art and add something beautiful.</p>
                        <Link to="/products" className="cart-shop-btn">
                            Browse Products <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-hero">
                <div className="container">
                    <span className="section-tag" style={{ color: '#D4A017' }}>Shopping</span>
                    <h1>Your Cart</h1>
                    <p>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                </div>
            </div>

            <div className="container cart-layout">
                {/* Items */}
                <div className="cart-items-section">
                    <div className="cart-items-header">
                        <Link to="/products" className="cart-back-link">
                            <ArrowLeft size={16} /> Continue Shopping
                        </Link>
                        <button onClick={clearCart} className="cart-clear-btn">Clear Cart</button>
                    </div>

                    <div className="cart-items-list">
                        {items.map(item => (
                            <div key={item.productId} className="cart-item">
                                <div className="cart-item-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} />
                                    ) : (
                                        <div className="cart-item-placeholder">
                                            <ShoppingBag size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="cart-item-info">
                                    <p className="cart-item-cat">{item.category}</p>
                                    <h4>{item.title}</h4>
                                    <span className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="cart-item-qty">
                                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                                        <Minus size={14} />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div className="cart-item-total">
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </div>
                                <button className="cart-item-remove" onClick={() => removeItem(item.productId)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="cart-summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>Shipping</span>
                        <span>₹{shipping}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>GST (18%)</span>
                        <span>₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="cart-summary-divider"></div>
                    <div className="cart-summary-row cart-summary-total">
                        <span>Total</span>
                        <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <Link to="/checkout" className="cart-checkout-btn">
                        Proceed to Checkout <ArrowRight size={18} />
                    </Link>
                    <p className="cart-secure-note">🔒 Secure checkout powered by Razorpay</p>
                </div>
            </div>
        </div>
    );
};

export default Cart;
