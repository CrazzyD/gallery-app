# Image Sharing Platform - Pinterest-like App

A minimalist, fast, and visually appealing image sharing platform built with Next.js, Express, and PostgreSQL.

## Features

✨ **Core Features**
- 🔐 User authentication with JWT
- 📸 Image upload (JPG, PNG, WEBP - up to 10MB)
- ❤️ Like/unlike images
- 🏠 Feed with sorting (recent, popular, most liked)
- 👤 User profiles with gallery
- 🔍 Search and filter by tags
- ♾️ Infinite scroll and lazy loading
- 📱 Fully responsive design
- 🌙 Minimalist UI with TailwindCSS

## Tech Stack

**Frontend**
- Next.js 14
- React 18
- TailwindCSS
- Axios
- Zustand (state management)

**Backend**
- Node.js + Express
- PostgreSQL
- JWT authentication
- Multer for file uploads

**DevOps**
- Docker & Docker Compose
- PostgreSQL 16

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional but recommended)
- PostgreSQL 16+ (if not using Docker)

### Option 1: With Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository>
cd image-sharing-platform

# Create .env file
cp .env.example .env

# Start all services
docker-compose up

# The app will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

### Option 2: Manual Setup

#### 1. Database Setup
```bash
# Create PostgreSQL database
createdb image_sharing

# Or using psql
psql -U postgres -c "CREATE DATABASE image_sharing;"

# Run migrations
cd database
node migrate.js
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Start development server
npm run dev
# App runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Images
- `GET /api/images` - Get all images (with pagination & sorting)
- `GET /api/images/:id` - Get single image
- `POST /api/images/upload` - Upload image (requires token)
- `DELETE /api/images/:id` - Delete image (requires token)

### Likes
- `POST /api/likes/:imageId/like` - Add like (requires token)
- `DELETE /api/likes/:imageId/like` - Remove like (requires token)

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/images` - Get user images

## Project Structure

```
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page routes
│   │   ├── store/           # Zustand stores
│   │   ├── layout.js        # Root layout
│   │   └── globals.css      # Global styles
│   ├── public/              # Static assets
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── backend/                 # Express application
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── config/          # Configuration
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Entry point
│   ├── uploads/             # Uploaded images
│   ├── package.json
│   └── Dockerfile
│
├── database/                # Database setup
│   ├── schema.sql           # Database schema
│   └── migrate.js           # Migration script
│
├── docker-compose.yml       # Docker Compose config
├── .env.example             # Environment variables template
└── README.md                # This file
```

## Environment Variables

### Backend (.env)
```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=image_sharing
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Next.js dev server
```

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
npm start
```

## Database Schema

### Users Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| username | VARCHAR(30) | Unique |
| email | VARCHAR(255) | Unique |
| password_hash | VARCHAR(255) | Hashed with bcrypt |
| avatar | VARCHAR(500) | Optional |
| created_at | TIMESTAMP | Auto-set |

### Images Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| title | VARCHAR(200) | Required |
| description | TEXT | Optional |
| image_url | VARCHAR(500) | File path |
| likes_count | INTEGER | Defaults to 0 |
| created_at | TIMESTAMP | Auto-set |

### Likes Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| image_id | UUID | Foreign key to images |
| created_at | TIMESTAMP | Auto-set |
| (user_id, image_id) | UNIQUE | Constraint |

## Future Features

- 💬 Comments on images
- 👥 Follow/unfollow users
- 🔖 Save images
- 🤖 AI-powered tags
- 🔎 Advanced search
- 🌙 Dark mode
- 🎬 Drag & drop upload
- ⚡ WebSocket for real-time updates
- 📊 Analytics dashboard

## Performance Optimizations

- ✅ Image lazy loading
- ✅ Infinite scroll pagination
- ✅ Database indexes on frequently queried columns
- ✅ Compression middleware
- ✅ CORS and security headers with Helmet
- ✅ JWT token-based authentication

## License

MIT

## Support

For issues or questions, please create an issue on GitHub.

---

**Built with ❤️ by the team**
