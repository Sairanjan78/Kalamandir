import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Package, User, MapPin, Clock, ChevronRight, LogOut,
    ShoppingBag, Settings, ArrowLeft, CheckCircle, Truck, XCircle, Loader2, Camera
} from 'lucide-react';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#f39c12', icon: <Clock size={14} /> },
    confirmed: { label: 'Confirmed', color: '#3498db', icon: <CheckCircle size={14} /> },
    processing: { label: 'Processing', color: '#9b59b6', icon: <Loader2 size={14} /> },
    shipped: { label: 'Shipped', color: '#2ecc71', icon: <Truck size={14} /> },
    delivered: { label: 'Delivered', color: '#27ae60', icon: <CheckCircle size={14} /> },
    cancelled: { label: 'Cancelled', color: '#e74c3c', icon: <XCircle size={14} /> },
};

const MyAccount = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [profileForm, setProfileForm] = useState({
        name: '', phone: ''
    });
    const [addresses, setAddresses] = useState([]);
    const [addressForm, setAddressForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [profilePhotoUploading, setProfilePhotoUploading] = useState(false);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        setProfileForm({
            name: user.name || '',
            phone: user.phone || ''
        });
        
        // Migrate legacy location to addresses if needed
        let initialAddresses = user.addresses || [];
        if (initialAddresses.length === 0 && user.location && user.location.city) {
            initialAddresses = [{
                ...user.location,
                label: 'Home',
                isDefault: true,
                _id: 'legacy'
            }];
        }
        setAddresses(initialAddresses);
    }, [user, navigate]);

    useEffect(() => {
        if (activeTab === 'orders' && user) fetchOrders();
    }, [activeTab, user]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.data?.orders || []);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveMsg('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/api/auth/profile', {
                name: profileForm.name,
                phone: profileForm.phone,
                addresses: addresses
            }, { headers: { Authorization: `Bearer ${token}` } });

            updateUser(res.data.data);
            setSaveMsg('Profile updated successfully!');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch (err) {
            setSaveMsg('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleProfilePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }

        const token = localStorage.getItem('token');
        const fd = new FormData();
        fd.append('photo', file);
        setProfilePhotoUploading(true);
        try {
            const uploadRes = await axios.post('/api/upload/profile-photo', fd, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = uploadRes.data.data.url;

            await axios.put('/api/auth/profile', { profileImage: imageUrl }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            updateUser({ profileImage: imageUrl });
        } catch (err) {
            console.error('Profile photo upload failed:', err);
            alert('Failed to update profile photo');
        } finally {
            setProfilePhotoUploading(false);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                if (res.data && res.data.address) {
                    const addr = res.data.address;
                    const street = [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ');
                    const city = addr.city || addr.town || addr.county || '';
                    
                    setAddressForm(prev => prev ? {
                        ...prev,
                        street: street || prev.street,
                        city: city || prev.city,
                        state: addr.state || prev.state,
                        pincode: addr.postcode || prev.pincode
                    } : null);
                }
            } catch (err) {
                console.error('Error fetching location', err);
                alert('Failed to get address from current location');
            } finally {
                setLocating(false);
            }
        }, (err) => {
            setLocating(false);
            alert('Unable to retrieve your location');
        });
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/orders/${orderId}/cancel`, { reason: 'Customer requested' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    if (!user) return null;

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    ];

    return (
        <div className="myaccount-page">
            <div className="cart-hero">
                <div className="container">
                    <span className="section-tag" style={{ color: '#D4A017' }}>My Account</span>
                    <h1>Welcome, {user.name?.split(' ')[0]}</h1>
                </div>
            </div>

            <div className="container myaccount-layout">
                {/* Sidebar */}
                <div className="myaccount-sidebar">
                    <div className="myaccount-user-card">
                        <div className="profile-avatar-wrapper" onClick={() => document.getElementById('profile-photo-input').click()} style={{ width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: 0 }}>
                            <input id="profile-photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePhotoChange} />
                            {user.profileImage ? (
                                <img src={user.profileImage} alt="" className="profile-avatar-img" />
                            ) : (
                                <div className="profile-avatar-fallback">
                                    {user.name?.[0] || '?'}
                                </div>
                            )}
                            <div className="profile-avatar-overlay">
                                {profilePhotoUploading ? (
                                    <div className="profile-avatar-spinner"></div>
                                ) : (
                                    <Camera size={16} />
                                )}
                            </div>
                        </div>
                        <div>
                            <strong>{user.name}</strong>
                            <span>{user.email}</span>
                        </div>
                    </div>
                    <nav className="myaccount-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`myaccount-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon} {tab.label} <ChevronRight size={14} className="nav-chevron" />
                            </button>
                        ))}
                        <button className="myaccount-nav-btn logout-nav" onClick={logout}>
                            <LogOut size={18} /> Logout
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="myaccount-content">
                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="myaccount-orders">
                            <h2>My Orders</h2>
                            {loadingOrders ? (
                                <div className="myaccount-loading">
                                    <Loader2 size={32} className="spin-icon" />
                                    <p>Loading orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="myaccount-empty">
                                    <ShoppingBag size={48} strokeWidth={1} />
                                    <h3>No orders yet</h3>
                                    <p>Your order history will appear here after your first purchase.</p>
                                    <Link to="/products" className="cart-shop-btn">Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="orders-list">
                                    {orders.map(order => {
                                        const st = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
                                        return (
                                            <div key={order._id} className="order-card">
                                                <div className="order-card-top">
                                                    <div>
                                                        <span className="order-id">#{order.orderId}</span>
                                                        <span className="order-date">
                                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                                day: 'numeric', month: 'short', year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <span className="order-status-badge" style={{ background: `${st.color}15`, color: st.color }}>
                                                        {st.icon} {st.label}
                                                    </span>
                                                </div>

                                                <div className="order-items-preview">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="order-item-mini">
                                                            {item.image ? (
                                                                <img src={item.image} alt="" />
                                                            ) : (
                                                                <div className="order-item-mini-ph"><Package size={14} /></div>
                                                            )}
                                                            <div>
                                                                <span>{item.title}</span>
                                                                <span className="order-item-qty">×{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="order-card-bottom">
                                                    <span className="order-total">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                                    {['pending', 'confirmed'].includes(order.orderStatus) && (
                                                        <button
                                                            onClick={() => handleCancelOrder(order._id)}
                                                            className="order-cancel-btn"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="myaccount-profile">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2>Edit Profile</h2>
                            </div>
                            {saveMsg && (
                                <p className={`profile-msg ${saveMsg.includes('success') ? 'success' : 'error'}`}>
                                    {saveMsg}
                                </p>
                            )}
                            <form onSubmit={handleProfileSave} className="profile-form">
                                <div className="checkout-form-grid">
                                    <div className="checkout-field">
                                        <label>Full Name</label>
                                        <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
                                    </div>
                                    <div className="checkout-field">
                                        <label>Phone</label>
                                        <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
                                    </div>
                                </div>
                                <button type="submit" disabled={saving} className="cart-checkout-btn" style={{ marginTop: '0.5rem' }}>
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </form>

                            <div style={{ marginTop: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h2>Address Book</h2>
                                    {!addressForm && (
                                        <button onClick={() => setAddressForm({ street: '', city: '', state: '', pincode: '', label: 'Home', isDefault: addresses.length === 0 })} className="cart-checkout-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                                            + Add New Address
                                        </button>
                                    )}
                                </div>

                                {addressForm ? (
                                    <div className="address-form-card" style={{ padding: '2rem', background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#3B2A1A' }}>{addressForm.index !== undefined ? 'Edit Address' : 'Add New Address'}</h4>
                                            <button type="button" onClick={handleUseCurrentLocation} disabled={locating} className="cart-checkout-btn" style={{ padding: '0.5rem 1rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', borderRadius: '8px' }}>
                                                <MapPin size={16} /> {locating ? 'Locating...' : 'Use GPS'}
                                            </button>
                                        </div>
                                        <div className="checkout-form-grid">
                                            <div className="checkout-field">
                                                <label style={{ fontWeight: '500', color: '#555' }}>Label</label>
                                                <select value={addressForm.label} onChange={e => setAddressForm(p => ({ ...p, label: e.target.value }))} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fcfcfc', color: '#333', outline: 'none' }}>
                                                    <option value="Home">Home</option>
                                                    <option value="Work">Work</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="checkout-field">
                                                <label style={{ fontWeight: '500', color: '#555' }}>Pincode (6 digits)</label>
                                                <input pattern="\d{6}" title="Please enter exactly 6 digits" required value={addressForm.pincode} onChange={e => setAddressForm(p => ({ ...p, pincode: e.target.value }))} placeholder="e.g. 756032" style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                                            </div>
                                        </div>
                                        <div className="checkout-field">
                                            <label style={{ fontWeight: '500', color: '#555' }}>Street Address (Must include House/Building No.)</label>
                                            <input 
                                                required 
                                                pattern=".*[0-9].*" 
                                                title="Address must contain a house or building number"
                                                value={addressForm.street} 
                                                onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))} 
                                                placeholder="e.g. Plot No 42, Main Street" 
                                                style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                            />
                                        </div>
                                        <div className="checkout-form-grid">
                                            <div className="checkout-field">
                                                <label style={{ fontWeight: '500', color: '#555' }}>City</label>
                                                <input required value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                                            </div>
                                            <div className="checkout-field">
                                                <label style={{ fontWeight: '500', color: '#555' }}>State</label>
                                                <input required value={addressForm.state} onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', padding: '1rem', background: '#faf9f5', borderRadius: '8px', border: '1px dashed #e8e2d2' }}>
                                            <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm(p => ({ ...p, isDefault: e.target.checked }))} style={{ width: '18px', height: '18px', margin: 0, cursor: 'pointer', accentColor: '#D4A017' }} />
                                            <label htmlFor="isDefault" style={{ margin: 0, cursor: 'pointer', fontWeight: '500', color: '#3B2A1A' }}>Set as my Default Address</label>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                            <button 
                                                onClick={() => {
                                                    let newAddresses = [...addresses];
                                                    if (addressForm.isDefault) {
                                                        newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
                                                    }
                                                    if (addressForm.index !== undefined) {
                                                        newAddresses[addressForm.index] = addressForm;
                                                    } else {
                                                        newAddresses.push(addressForm);
                                                    }
                                                    setAddresses(newAddresses);
                                                    setAddressForm(null);
                                                }}
                                                className="cart-checkout-btn" style={{ width: 'auto', padding: '0.8rem 2rem', borderRadius: '8px' }}
                                            >
                                                Save Address
                                            </button>
                                            <button onClick={() => setAddressForm(null)} style={{ width: 'auto', padding: '0.8rem 2rem', borderRadius: '8px', background: 'transparent', border: '1px solid #ddd', color: '#555', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="addresses-list" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                                        {addresses.map((addr, idx) => (
                                            <div key={idx} style={{ padding: '1rem', border: addr.isDefault ? '2px solid #D4A017' : '1px solid #ddd', borderRadius: '8px', position: 'relative' }}>
                                                {addr.isDefault && <span style={{ position: 'absolute', top: '-10px', right: '10px', background: '#D4A017', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>Default</span>}
                                                <span style={{ display: 'inline-block', padding: '2px 8px', background: '#f0ebe2', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{addr.label}</span>
                                                <p style={{ margin: '0 0 0.5rem' }}><strong>{addr.street}</strong></p>
                                                <p style={{ margin: '0 0 0.5rem', color: '#666' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <button onClick={() => setAddressForm({ ...addr, index: idx })} style={{ color: '#D4A017', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit</button>
                                                    <button onClick={() => setAddresses(addresses.filter((_, i) => i !== idx))} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                        {addresses.length === 0 && <p>No addresses saved yet.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="myaccount-settings">
                            <h2>Settings</h2>
                            <div className="settings-card">
                                <h4>Account Type</h4>
                                <p>You are logged in as a <strong>{user.role === 'artist' ? 'Artist' : 'Customer'}</strong>.</p>
                                {user.role === 'artist' && (
                                    <Link to="/dashboard" className="cart-shop-btn" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                                        Go to Artist Dashboard
                                    </Link>
                                )}
                            </div>
                            <div className="settings-card danger-zone">
                                <h4>Danger Zone</h4>
                                <p>Logging out will clear your session. Your cart items will be preserved.</p>
                                <button onClick={logout} className="settings-logout-btn">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
