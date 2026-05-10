# Indian Art Marketplace Frontend

A simple React frontend for the Indian Art Marketplace backend, built with Vite and using plain HTML/CSS.

## Features

- Responsive product grid layout
- Fetches products from backend API (fallback to mock data if API unavailable)
- Clean, modern UI with gradient header and card shadows
- Demo mode with sample art products
- Retry mechanism for backend connection

## Prerequisites

- Node.js (v18 or later)
- npm or yarn

## Setup

1. **Clone the repository** (if not already done)
2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```
3. **Start the backend server** (in a separate terminal):
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend runs on `http://localhost:5000` and requires MongoDB. If MongoDB is not running, the frontend will automatically use mock data.

4. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

5. Open your browser and navigate to `http://localhost:5173`.

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Global styles
│   └── assets/          # Static images (if any)
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## API Integration

The frontend attempts to fetch products from `http://localhost:5000/api/products`. If the request fails (e.g., backend not running, MongoDB unavailable), it falls back to displaying mock product data with a demo notice.

You can modify the API endpoint in `App.jsx` (`fetchProducts` function) to point to your production backend.

## Customization

- **Styling**: Edit `App.css` to change colors, spacing, or layout.
- **Mock Data**: Update the `mockProducts` array in `App.jsx` to change demo products.
- **Components**: The app is a single component for simplicity. For larger projects, consider splitting into separate components (ProductCard, Header, Footer).

## Available Scripts

- `npm run dev` – Start development server with hot reload
- `npm run build` – Build for production
- `npm run preview` – Preview production build locally
- `npm run lint` – Run ESLint

## Notes

- This frontend is designed to work with the existing Indian Art Marketplace backend (Node.js/Express/MongoDB).
- The backend must have CORS configured to allow requests from `http://localhost:5173`.
- Images in mock data are sourced from Unsplash placeholder URLs.

## License

MIT
