# CampusLoop 🔄

> Smart Campus Resource Sharing — A verified peer-to-peer web application helping students discover, circulate, borrow, and return underused academic and campus resources safely with QR verification and Green Points incentives.

---

## 📁 Suggested Repository Structure

```text
CampusLoop/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Shared UI components (Navbar, Footer, Layout)
│   │   ├── pages/              # Placeholder pages (Login, Register, Marketplace, Dashboard, Landing)
│   │   ├── features/           # Feature-specific modules (future sprints)
│   │   ├── services/           # API service integrations (future sprints)
│   │   ├── routes/             # Route configurations
│   │   ├── App.jsx             # React Router setup
│   │   ├── index.css           # Tailwind CSS imports and base styles
│   │   └── main.jsx            # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # DB & app configs (Mongoose connection)
│   │   ├── controllers/        # Request handlers (future sprints)
│   │   ├── middleware/         # Auth & validation middleware (future sprints)
│   │   ├── models/             # Mongoose schemas (future sprints)
│   │   ├── routes/             # Express route definitions (/api/health)
│   │   ├── services/           # Business logic (future sprints)
│   │   ├── utils/              # Helper functions & token utilities (future sprints)
│   │   ├── app.js              # Express app setup & middleware
│   │   └── index.js            # Server entry point
│   ├── .env.example
│   └── package.json
│
├── docs/                       # Project specifications & documentation
│   └── specs.pdf
├── .env.example                # Global environment variables template
├── .gitignore
├── AGENTS.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+ (or pnpm / yarn)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string

---

### 1. Backend Setup (`server/`)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

4. Update your `.env` file with your MongoDB connection string if necessary:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campusloop
   CLIENT_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```

6. Verify server health:
   - Access [http://localhost:5000/api/health](http://localhost:5000/api/health) in your browser.

---

### 2. Frontend Setup (`client/`)

1. In a separate terminal, navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the frontend application:
   - Access [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧭 Frontend Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Introduction to CampusLoop and quick access |
| `/login` | Login | Placeholder student login |
| `/register` | Register | Placeholder student registration |
| `/marketplace` | Marketplace | Placeholder item search and listings |
| `/dashboard` | Dashboard | Placeholder borrower/owner metrics and active borrowings |

---

## 🔌 API Endpoints (Current Scaffold)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status index |
| `GET` | `/api/health` | Service uptime and MongoDB connection health check |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, Lucide Icons
- **Backend**: Node.js, Express, Mongoose, Dotenv, CORS
- **Database**: MongoDB
