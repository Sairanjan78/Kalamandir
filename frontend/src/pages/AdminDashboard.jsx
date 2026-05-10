import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    ShoppingBag, 
    DollarSign, 
    TrendingUp, 
    ShieldCheck, 
    Package,
    ArrowUpRight,
    Search,
    Menu,
    X,
    LayoutDashboard,
    Settings,
    LogOut,
    Home
} from 'lucide-react';

const AdminDashboard = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        activeArtists: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            if (activeTab === 'dashboard') fetchAdminData();
            if (activeTab === 'users') fetchAllUsers();
            if (activeTab === 'products') fetchAllProducts();
        }
    }, [authLoading, user, activeTab]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const dashboardData = res.data.data;
            
            setStats({
                totalUsers: dashboardData.stats.totalUsers,
                totalProducts: dashboardData.stats.totalProducts,
                totalRevenue: dashboardData.stats.totalRevenue,
                activeArtists: dashboardData.stats.activeArtists
            });

            const formattedUsers = dashboardData.recentUsers.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
                joined: new Date(u.createdAt).toLocaleDateString()
            }));

            setRecentUsers(formattedUsers);
        } catch (err) {
            console.error('Admin fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsers(res.data.data);
        } catch (err) {
            console.error('Fetch users error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/products');
            setAllProducts(res.data.data.products || res.data.data || []);
        } catch (err) {
            console.error('Fetch products error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (userId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/admin/update-status', { userId, status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllUsers(); // Refresh list
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllUsers(); // Refresh list
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    if (authLoading) {
        return (
            <div className="container" style={{padding: '150px 0', textAlign: 'center'}}>
                <div className="loading-spinner" style={{margin: '0 auto'}}></div>
                <p style={{marginTop: '1rem'}}>Verifying admin credentials...</p>
            </div>
        );
    }

    if (user?.role !== 'admin') {
        return (
            <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>
                <ShieldCheck size={64} color="#e74c3c" />
                <h2>Access Denied</h2>
                <p>Administrative privileges required.</p>
            </div>
        );
    }

    const renderDashboard = () => (
        <>
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-icon-w users"><Users size={24} /></div>
                    <div className="stat-info-w">
                        <span className="label">Total Users</span>
                        <h3>{stats.totalUsers}</h3>
                        <span className="trend positive"><ArrowUpRight size={14} /> 12%</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon-w products"><Package size={24} /></div>
                    <div className="stat-info-w">
                        <span className="label">Artworks Listed</span>
                        <h3>{stats.totalProducts}</h3>
                        <span className="trend positive"><ArrowUpRight size={14} /> 8%</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon-w revenue"><DollarSign size={24} /></div>
                    <div className="stat-info-w">
                        <span className="label">Total Revenue</span>
                        <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                        <span className="trend positive"><ArrowUpRight size={14} /> 24%</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon-w growth"><TrendingUp size={24} /></div>
                    <div className="stat-info-w">
                        <span className="label">Artists Growth</span>
                        <h3>{stats.activeArtists}</h3>
                        <span className="trend positive"><ArrowUpRight size={14} /> 5%</span>
                    </div>
                </div>
            </div>

            <div className="admin-content-layout">
                <section className="recent-activity-section">
                    <div className="section-header">
                        <h2>Recent Registrations</h2>
                        <button className="view-all-admin" onClick={() => setActiveTab('users')}>View All</button>
                    </div>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="admin-user-cell">
                                                <div className="avatar-small">{u.name[0]}</div>
                                                <div>
                                                    <strong>{u.name}</strong>
                                                    <br/>
                                                    <small>{u.email}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                                        <td><span className="status-dot active">Active</span></td>
                                        <td>{u.joined}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <aside className="admin-sidebar-info">
                    <div className="info-card">
                        <h3>System Health</h3>
                        <div className="health-stat">
                            <span>Server Status</span>
                            <span className="health-good">Excellent</span>
                        </div>
                        <div className="health-stat">
                            <span>DB Connection</span>
                            <span className="health-good">Stable</span>
                        </div>
                        <div className="health-stat">
                            <span>Cloudinary Sync</span>
                            <span className="health-good">Up to date</span>
                        </div>
                    </div>
                    
                    <div className="action-card">
                        <h3>Quick Actions</h3>
                        <button className="admin-action-btn">Export Report</button>
                        <button className="admin-action-btn secondary">Broadcast Message</button>
                    </div>
                </aside>
            </div>
        </>
    );

    const renderUsers = () => (
        <section className="recent-activity-section" style={{maxWidth: '100%'}}>
            <div className="section-header">
                <h2>User Management</h2>
                <div className="search-bar-inline" style={{display: 'flex', background: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '10px', gap: '0.8rem'}}>
                    <Search size={18} color="#888" />
                    <input type="text" placeholder="Search by name or email..." style={{border: 'none', background: 'transparent', outline: 'none', width: '250px'}} />
                </div>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Details</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(u => (
                            <tr key={u._id}>
                                <td>
                                    <div className="admin-user-cell">
                                        <div className="avatar-small" style={{background: u.role === 'admin' ? '#aa3bff' : u.role === 'artist' ? '#C4622D' : '#3B2A1A'}}>{u.name[0]}</div>
                                        <div>
                                            <strong>{u.name}</strong>
                                            <br/>
                                            <small>{u.email}</small>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={`role-badge ${u.role}`}>{u.role.toUpperCase()}</span></td>
                                <td>
                                    {u.role === 'artist' ? (
                                        <span className={`status-pill ${u.artistStatus}`}>
                                            {u.artistStatus.toUpperCase()}
                                        </span>
                                    ) : (
                                        <span className="status-pill none">N/A</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                        {/* Pending artist: show Approve + Reject */}
                                        {u.role === 'artist' && u.artistStatus === 'pending' && (
                                            <>
                                                <button
                                                    className="view-all-admin"
                                                    style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#27ae60', color: 'white', borderColor: '#27ae60'}}
                                                    onClick={() => handleUpdateStatus(u._id, 'approved')}
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    className="view-all-admin"
                                                    style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#e74c3c', color: 'white', borderColor: '#e74c3c'}}
                                                    onClick={() => handleUpdateStatus(u._id, 'rejected')}
                                                >
                                                    ✗ Reject
                                                </button>
                                            </>
                                        )}
                                        {/* Approved artist: show Remove only */}
                                        {u.role === 'artist' && u.artistStatus === 'approved' && (
                                            <button
                                                className="view-all-admin"
                                                style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#e74c3c', color: 'white', borderColor: '#e74c3c'}}
                                                onClick={() => handleDeleteUser(u._id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        {/* Customer: show Remove */}
                                        {u.role === 'customer' && (
                                            <button
                                                className="view-all-admin"
                                                style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#e74c3c', color: 'white', borderColor: '#e74c3c'}}
                                                onClick={() => handleDeleteUser(u._id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        {/* Admin: no actions */}
                                        {u.role === 'admin' && (
                                            <span style={{fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic'}}>Protected</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

    const renderProducts = () => (
        <section className="recent-activity-section" style={{maxWidth: '100%'}}>
            <div className="section-header">
                <h2>Product Inventory</h2>
                <button className="admin-action-btn" style={{padding: '0.6rem 1.2rem'}}>+ Add New</button>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Artwork</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProducts.map(p => (
                            <tr key={p._id}>
                                <td>
                                    <div className="admin-user-cell">
                                        <img src={p.images?.[0]?.url || 'https://placehold.co/40x40?text=No+Img'} alt="" style={{width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover'}} />
                                        <strong>{p.title}</strong>
                                    </div>
                                </td>
                                <td>{p.category}</td>
                                <td>₹{p.price}</td>
                                <td>{p.stock}</td>
                                <td>
                                    <button className="view-all-admin" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

    return (
        <div className={`admin-layout ${!isSidebarOpen ? 'collapsed' : ''}`}>
            {isSidebarOpen && window.innerWidth <= 1024 && <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <h2>Admin Panel</h2>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <nav className="admin-sidebar-nav">
                    <button 
                        className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={20} /> Manage Users
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <Package size={20} /> Products
                    </button>
                    <button className="nav-btn"><Settings size={20} /> Settings</button>
                </nav>
                <div className="admin-sidebar-footer" style={{ marginTop: 'auto', padding: '0 1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <Link to="/" className="nav-btn" style={{ textDecoration: 'none' }}><Home size={20} /> Storefront</Link>
                    <button className="nav-btn" onClick={handleLogout} style={{ color: '#e74c3c' }}><LogOut size={20} /> Logout</button>
                </div>
            </aside>

            <div className="admin-main-content">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu size={28} />
                        </button>
                        <div>
                            <h1 className="topbar-title">
                                {activeTab === 'dashboard' ? 'Command Center' : 
                                 activeTab === 'users' ? 'User Management' : 'Inventory'}
                            </h1>
                        </div>
                    </div>
                    <div className="admin-badge">
                        <ShieldCheck size={18} />
                        <span>Admin Verified</span>
                    </div>
                </header>

                <div className="admin-content-inner">
                    {loading ? (
                        <div style={{textAlign: 'center', padding: '100px 0'}}>
                            <div className="loading-spinner" style={{margin: '0 auto'}}></div>
                            <p>Loading {activeTab}...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'users' && renderUsers()}
                            {activeTab === 'products' && renderProducts()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
