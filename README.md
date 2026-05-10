# Kalamandir — Indian Art Marketplace

A modern full-stack marketplace platform connecting Indian artisans with art lovers. Built with React, Node.js, Express, and MongoDB.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)

## Features

- **Artist Dashboard** — Manage products, profile, and inventory
- **Admin Panel** — Approve artists, manage users and products
- **Product Listings** — Browse, search, and filter artworks
- **Profile Photo Upload** — Change profile pictures with real-time preview
- **Responsive Design** — Premium UI that works on all devices
- **Role-Based Access** — Customer, Artist, and Admin roles

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router, Axios |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas                      |
| Auth      | JWT, bcrypt                        |
| Uploads   | Multer                             |
| Styling   | Vanilla CSS (custom design system) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/Sairanjan78/kalamandir.git
cd kalamandir

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

### Running the App

```bash
# Terminal 1 — Start backend
cd backend
npm run dev

# Terminal 2 — Start frontend
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
kalamandir/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   └── vite.config.js
└── README.md
```

## Author

**Sairanjan** — [GitHub](https://github.com/Sairanjan78)