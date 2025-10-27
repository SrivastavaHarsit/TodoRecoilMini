# Advanced Todo App with React + Recoil

A full-stack todo application built to learn and demonstrate advanced Recoil state management patterns. This is a personal learning project focused on implementing real-world frontend optimization techniques.

## Why This Project?

Most tutorials cover basic Recoil atoms and selectors. This project goes deeper—implementing patterns you'd actually use in production apps: atomFamily, selectorFamily, cache management, and optimistic updates.

## Features

- Full CRUD operations for todos
- Real-time search with debouncing
- Filter by status (all/completed/incomplete)
- Optimistic UI updates
- MongoDB persistence via Express backend

## Tech Stack

**Frontend:** React 18, Recoil, Axios, Vite  
**Backend:** Express.js, MongoDB, Mongoose, Zod

## Advanced Recoil Patterns Implemented

- **atomFamily** - Individual state for each todo item
- **selectorFamily** - Parameterized queries to fetch todos by ID
- **Cache optimization** - Fetch list once, use selectors for individual items (avoids N+1 queries)
- **Loadable states** - Proper handling of loading/error states
- **Cache invalidation** - Custom hook to refresh data after mutations

## Project Structure

```
todoRecoil/
├── frontend/frontend-recoil/
│   ├── src/
│   │   ├── api/          # API calls
│   │   ├── components/   # React components
│   │   ├── state/        # Recoil atoms & selectors
│   │   └── utils/        # Helper hooks
│   └── package.json
└── backend/
    ├── db.js             # MongoDB connection
    ├── index.js          # Express server
    ├── types.js          # Zod validation
    └── package.json
```

## Setup

**1. Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend/frontend-recoil
npm install
```

**2. Configure environment variables**

Create `.env` in `backend/`:
```
MONGO_URL=your_mongodb_connection_string
```

Create `.env` in `frontend/frontend-recoil/`:
```
VITE_API_URL=http://localhost:3000
```

**3. Run the application**

```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Frontend
cd frontend/frontend-recoil
npm run dev
```

Backend runs on `http://localhost:3000`  
Frontend runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | List todos (supports search, status, pagination) |
| POST | `/todo` | Create new todo |
| PUT | `/completed` | Toggle todo completion |
| PATCH | `/todos/:id` | Update todo content |
| DELETE | `/todos/:id` | Delete todo |

## Learning Goals

This project demonstrates:
- Moving beyond basic Recoil patterns
- Efficient state management for complex apps
- Proper cache management and invalidation
- Optimistic updates with error handling
- Debouncing for API optimization

## Note

This is a personal learning project for educational purposes, not intended for production use. Use it as a reference for implementing similar patterns in your own applications.

## License

MIT