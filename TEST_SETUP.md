# 🧪 Test Setup Guide

This guide will help you verify that the Indian Art Marketplace is set up correctly.

## ✅ Prerequisites Check

### 1. Verify Node.js Installation
```bash
node --version
# Should show v16 or higher

npm --version
# Should show v8 or higher
```

### 2. Verify MongoDB
```bash
# If using local MongoDB
mongod --version
# Or check if MongoDB service is running
```

### 3. Check Directory Structure
```
d:/craft/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── middleware/
└── frontend/
    ├── package.json
    ├── src/
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Quick Start Test

### Step 1: Start Backend Server
```bash
cd backend
npm install
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
🌐 API available at http://localhost:5000/api
✅ MongoDB connected successfully
```

### Step 2: Test Backend API
Open browser or use curl:
```
http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Indian Art Marketplace API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm start
```

Expected output:
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

### Step 4: Verify Frontend
Open browser: http://localhost:3000

You should see:
- Navigation bar with logo and menu
- Hero section with "Discover India's Living Art"
- Art categories section
- Featured artists
- Featured products
- Footer

## 🔧 Environment Configuration

### Backend (.env) - Update these values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/indian_art_marketplace
JWT_SECRET=your_jwt_secret_key_change_this_in_production
# Optional for full functionality:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# RAZORPAY_KEY_ID=your_razorpay_key_id
# RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration
Check `frontend/package.json` scripts:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## 🧪 API Endpoints Test

Use Postman or curl to test:

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
**Error**: `MongoDB connection error`
**Solution**:
1. Ensure MongoDB is running: `mongod`
2. Check connection string in `.env`
3. For MongoDB Atlas, ensure IP is whitelisted

### Issue 2: Port Already in Use
**Error**: `EADDRINUSE: port 5000 already in use`
**Solution**:
1. Change PORT in `.env` to another value (e.g., 5001)
2. Or kill process using port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Issue 3: Frontend Build Errors
**Error**: `Module not found` or TypeScript errors
**Solution**:
1. Reinstall dependencies:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

2. Check TypeScript configuration
3. Verify all imports are correct

### Issue 4: CORS Errors
**Error**: `Access-Control-Allow-Origin`
**Solution**:
1. Ensure `FRONTEND_URL` in `.env` matches frontend URL
2. Check CORS configuration in `server.js`

## 📊 Database Test

### Create Test Data
Use MongoDB Compass or mongo shell:
```javascript
// Connect to MongoDB
use indian_art_marketplace

// Insert test user
db.users.insertOne({
  name: "Test Artist",
  email: "artist@example.com",
  password: "$2a$10$...", // Hashed password
  role: "artist",
  createdAt: new Date()
})

// Insert test product
db.products.insertOne({
  title: "Test Painting",
  description: "Beautiful traditional art",
  price: 5000,
  artistId: ObjectId("..."),
  category: "Painting",
  stock: 1,
  isActive: true,
  createdAt: new Date()
})
```

## 🎯 Feature Verification Checklist

### Backend Features
- [x] Server starts without errors
- [x] MongoDB connection successful
- [x] API endpoints respond
- [x] JWT authentication works
- [x] File upload configured (if Cloudinary set up)
- [x] Payment gateway integration (if Razorpay set up)

### Frontend Features
- [x] React app compiles and runs
- [x] Landing page displays correctly
- [x] Navigation works
- [x] Responsive design
- [x] API calls can be made
- [x] Tailwind CSS styles applied

### Database Features
- [x] Collections created
- [x] Models can save/retrieve data
- [x] Relationships work (artist → products)
- [x] Indexes created

## 🚀 Next Steps After Testing

1. **Set up production environment variables**
2. **Configure SSL certificates** for HTTPS
3. **Set up monitoring** (logging, error tracking)
4. **Implement CI/CD pipeline**
5. **Add unit and integration tests**
6. **Set up backup strategy** for database

## 📞 Support

If you encounter issues:
1. Check the error logs
2. Verify all prerequisites
3. Review configuration files
4. Check network connectivity
5. Consult the README.md for detailed setup

---

✅ **Test Complete** - Your Indian Art Marketplace is ready for development!